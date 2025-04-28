import os
import uuid
import bcrypt
import datetime

from flask import Flask, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from werkzeug.utils import secure_filename
import flask_login

from src.db.db import db
from src.models.user import User
from src.models.course import Course
from src.models.attended_course import AttendedCourse

from src.langchain.llm import trigger_llama_chain, evaluate_quiz


app = Flask(__name__, static_url_path="/static")
secret_key = uuid.uuid4().hex
app.secret_key = secret_key

username = "root"
password = "root"
host = "localhost"
database = "courseai"

upload_folder = os.environ.get("UPLOAD_FOLDER")
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://{0}:{1}@{2}/{3}".format(username, password, host, database)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

jwt = JWTManager(app)

db.init_app(app)

@login_manager.user_loader
def user_loader(user_id):
    print(user_id)
    user = User.get_user_by_id(user_id)
    return user

#! AUTHENTICATION

@app.post("/login")
def login():
    if not request.json["username"] or not request.json["password"]:
        response = jsonify({"message": "Please fill in all the required details.", "status": 401})
        return response, 401
    
    if len(request.json["username"]) == 0 or len(request.json["password"]) == 0:
        response = jsonify({"message": "Please fill in all the required details.", "status": 401})
        return response, 401

    user = User.get_user_by_username(request.json["username"])

    if user is None:
        response = jsonify({"message": "Invalid credentials.", "status": 401})
        return response, 401

    received_password = request.json["password"]
    received_password = received_password.encode()
    
    if bcrypt.checkpw(received_password, user.password.encode()):
        flask_login.login_user(user)
        user = User.orm_to_dict(user)
        del user["password"] 

        access_token = create_access_token(identity={**user, "role": user["role"].name})
        return jsonify({ "token": access_token, "status": 200}), 200
    
    response = jsonify({"message": "Invalid credentials.", "status": 401})
    return response, 401

@app.post("/register")
def register():    
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]
    fullname = request.json["fullname"]

    if username is None or email is None or password is None or fullname is None:
        response = jsonify({"message": "Please fill in all the required details.", "status": 401})
        return response, 401
    
    if len(request.json["username"]) == 0 or len(request.json["password"]) == 0 or len(request.json["email"]) == 0 or len(request.json["fullname"]) == 0:
        response = jsonify({"message": "Please fill in all the required details.", "status": 401})
        return response, 401
    
    is_email_valid = User.validate_email(request.json["email"])

    if not is_email_valid:
        response = jsonify({"message": "Invalid email, please enter a valid email", "status": 401})
        return response, 401

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)

    user = User.create_user({"username": username, "email": email, "password": hashed_password.decode(), "fullname": fullname})

    if user is None:
        response = jsonify({"message": "Invalid request.", "status": 400})
        return response, 400

    response = jsonify({"message": "Register successful.", "status": 201})
    return response, 201 

@app.post("/logout")
@jwt_required()
@flask_login.login_required
def logout():
    current_user = get_jwt_identity()

    flask_login.logout_user()

    response = jsonify({"message": "{0} logged out successfuly.".format(current_user), "status": 200})
    return response, 200

#! COURSES

@app.get("/courses")
def get_courses():
    courses = Course.get_courses()
    returned_courses = []

    if courses is None:
        return jsonify({"error": "No courses found."}), 404
    
    for course in courses:
        course_dict = course._asdict()
        course_dict_contents = course_dict["Course"]
        returned_courses.append(Course.orm_to_dict(course_dict_contents))

    response = jsonify({"courses": list(returned_courses)})
    return response, 201

@app.get("/course/<course_id>")
def get_course(course_id):
    course = Course.get_course(course_id)
    course_dict = Course.orm_to_dict(course)

    response = jsonify(course_dict)
    return response, 200


@app.get("/courses_home")
def get_courses_on_home():
    courses = Course.get_courses_with_limit()
    returned_courses = []

    if courses is None:
        return jsonify({"error": "No courses found."}), 404
    
    for course in courses:
        course_dict = course._asdict()
        course_dict_contents = course_dict["Course"]
        returned_courses.append(Course.orm_to_dict(course_dict_contents))

    response = jsonify({"courses": list(returned_courses)})
    return response, 201

@jwt_required()
@flask_login.login_required
@app.post("/create_course")
def create_location():
    entry = request.json

    for _, value in entry.items():
        if value == "":
            response = jsonify({"message": "Invalid Course data.", "status": 401})
            return response, 401
        
    Course.create_course(entry)

    response = jsonify({"message": "Course created successfully!", "status": 201})
    return response, 201

@jwt_required()
@flask_login.login_required
@app.post("/edit_course")
def edit_course():
    entry = request.json
    for _, value in entry.items():
        if value == "":
            response = jsonify({"message": "Invalid Course data.", "status": 401})
            return response, 401
    
    value = Course.edit_course(entry)
    response = jsonify({"message": "Course edited succesfully!", "status": 201})
    return response, 201

@jwt_required()
@flask_login.login_required
@app.post("/delete_course")
def delete_course():
    try:
        course_id = request.json["id"]
        Course.delete_course(course_id)
        response = jsonify({"message": "Course deleted succesfully!", "status": 201})
        return response, 201
    except:
        response = jsonify({"message": "Invalid id.", "status": 401})
        return response, 401

#! IMAGES

@jwt_required()
@flask_login.login_required
@app.post("/upload/<filename>")
def upload_image(filename):
    image = request.files['file']

    if not image:
        response = jsonify({"message": "No file present in the request body.", "status": 400})
        return response, 400
    
    if not secure_filename(filename):
        response = jsonify({"message": "Invalid filename.", "status": 400})
        return response, 400
    
    extension = image.filename.split(".")
    uploaded_filename = "{0}.{1}".format(filename, extension[1])

    saving_directory = os.path.join(upload_folder, "courses", uploaded_filename)
    image.save(saving_directory)

    response = jsonify({"message": "Image uploaded successfully!", "filename": uploaded_filename, "status": 201})
    return response, 201

@app.get("/evaluate/<course_id>")
def evaluate_course(course_id):
    course = Course.get_course(course_id)
    course_dict = Course.orm_to_dict(course)

    content = course_dict["content"]
    quiz = trigger_llama_chain(content)

    response = jsonify({"quiz": quiz})
    return response, 200

@flask_login.login_required
@app.post("/evaluate/<course_id>")
def grade_quiz(course_id):
    entry = request.json
    for _, value in entry.items():
        if value == "":
            response = jsonify({"message": "Invalid Quiz data.", "status": 401})
            return response, 401
    
    quiz_string = entry["quiz"]
    answers = entry["answers"]

    course = Course.get_course(course_id)
    course_dict = Course.orm_to_dict(course)

    content = course_dict["content"]
    evaluation = evaluate_quiz(content, quiz_string, answers)

    grade = AttendedCourse.create_attended_course({"id_course": course_id, "id_user": flask_login.current_user.id, "grade": evaluation["grade"]})
    print(grade)

    response = jsonify({"grade": evaluation["grade"]})

    return response, 201

@flask_login.login_required
@app.get("/history")
def get_attended_courses():
    attended_courses = []

    user_id = flask_login.current_user.id
    user_gradings = AttendedCourse.get_gradings_for_user(user_id)

    for grading in user_gradings:
        current_grading = grading._asdict()
        attended_courses.append(current_grading)

    response = jsonify({"attended_courses": attended_courses})
    return response, 200

@app.get("/logged_in")
def is_logged_in():
    try:
        user_id = flask_login.current_user.id
        response = jsonify({"status": 1, "id": user_id})
        return response, 200
    except:
        response = jsonify({"status": 0})
        return response, 200