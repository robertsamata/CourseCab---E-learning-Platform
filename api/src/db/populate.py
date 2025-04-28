import os
import json
import mysql.connector

class Database():
    _instance = None

    #! DATABASE SINGLETON => USED FOR ALL DB OPERATIONS
    #! MODELS WILL DIRECTLY COMMUNICATE WITH THIS SECTION
    #! THE SERVER CODE IS DATABASE AGNOSTIC
    #! THE SERVER CODE JUST CALLS THE MODEL METHODS

    def __new__(cls):
        if not cls._instance:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.accesor = None
            cls._instance.username = "root"
            cls._instance.password = "serendipity"
            cls._instance.host = "localhost"
            cls._instance.database = "courseai"
        return cls._instance
    
    def get_accesor(self):
        if not self.accesor:
            self.accesor = mysql.connector.connect(user=self.username, password=self.password, host=self.host, database=self.database,  charset='utf8mb4')
        return self.accesor
    
    #! EVERY TABLE YOU WANT TO CREATE YOU WILL CREATE HERE.
    #! APPEND EVERY CREATION SEQUENCE TO THIS STRING

    def initialize(self):
        accessor = self.get_accesor()
        cursor = accessor.cursor()
        cursor.execute("""CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(45) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fullname VARCHAR(200) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL
        );""")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(70) NOT NULL,
        description VARCHAR(255),
        content TEXT,
        picture VARCHAR(100),
        date_added DATETIME default CURRENT_TIMESTAMP
        );
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS attended_courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_course INT,
        id_user INT,
        grade INT,
        date_created DATETIME default CURRENT_TIMESTAMP,
        FOREIGN KEY (id_course) REFERENCES courses(id),
        FOREIGN KEY (id_user) REFERENCES users(id)
        );
        """)
    #! FUNCTION USED BY MODELS TO EXECUTE EVERY QUERY OF THE APP
    #! CHECK USERS MODEL TO SEE HOW YOU FORMAT THIS QUERIES

    def execute_query(self, query=str, params=()):
        accesor = self.get_accesor()
        cursor = accesor.cursor()

        if query.strip().upper().startswith("SELECT"):
            cursor.execute(query)
            result = cursor.fetchall()
            return result
        else:
            cursor.execute(query, params)
            accesor.commit()
            return cursor.lastrowid;

db = Database()
db.initialize()