CourseCab - E-learning Platform
CourseCab is a web-based e-learning platform that allows users to browse, enroll in, and complete online courses. It is designed to offer a smooth learning experience, combining user-friendly navigation with essential educational features.

✨ Features
User authentication (registration and login)
Browse and search available courses
Enroll in courses
Watch course videos and access materials
Progress tracking
Admin panel for managing users and courses

🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript, Bootstrap
Backend: PHP
Database: MySQL
Other tools: Apache server (XAMPP/WAMP)

📦 Installation
Clone the repository
bash
git clone https://github.com/robertsamata/CourseCab---E-learning-Platform.git

Set up the server
Install XAMPP or WAMP.
Start Apache and MySQL services.
Database setup
Open phpMyAdmin.
Create a new database named coursecab.
Import the provided SQL file (coursecab.sql) into the database.
Configure project
Place the project folder inside the htdocs directory (for XAMPP) or the appropriate WAMP directory.
Update database connection settings in config.php if necessary.
Run the application
Open your browser and navigate to:
arduino
http://localhost/CourseCab---E-learning-Platform/

🧑‍💻 Usage
Students can register, browse courses, enroll, and track their progress.
Admins can add, edit, or delete courses, and manage users via the admin dashboard.

📄 Project Structure
bash
CourseCab---E-learning-Platform/
│
├── admin/         # Admin panel files
├── config/        # Database configuration
├── css/           # Stylesheets
├── img/           # Images and assets
├── js/            # JavaScript files
├── uploads/       # Course materials and videos
├── index.php      # Homepage
├── login.php      # User login
├── register.php   # User registration
└── ...

✅ To Do / Possible Improvements
Add quizzes and assessments for courses

Implement certificate generation upon course completion

Enable email notifications

Improve UI/UX design
