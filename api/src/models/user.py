import re
import enum
from flask_login import UserMixin
from sqlalchemy import String, Enum, UniqueConstraint
from sqlalchemy.exc import NoResultFound, IntegrityError
from sqlalchemy.orm import Mapped, mapped_column
from src.db.db import db
from src.models.base import Base

class RoleEnum(enum.Enum):
    user = "user"
    admin = "admin"

class User(Base, UserMixin):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("username", "role"), )

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(45))
    password: Mapped[str] = mapped_column(String(255))
    fullname: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    role: Mapped[RoleEnum] = mapped_column(Enum(RoleEnum))

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, username={self.username!r}, password={self.password!r}, email={self.email!r}, role={self.role!r},  fullname={self.fullname!r})"
    
    @staticmethod
    def validate_email(email):
        return bool(re.search(r"^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$", email))

    @staticmethod
    def create_user(entry=dict):
            username = entry["username"]
            password = entry["password"]
            fullname = entry["fullname"]
            email = entry["email"]

            try:
                created_user = User(username=username, password=password, email=email, role=RoleEnum.user, fullname=fullname)
                db.session.add(created_user)
                db.session.commit()
                return created_user
            except IntegrityError as e:
                print(e)
                return None

    @staticmethod
    def get_user_by_username(username):
        try:
            user = db.session.execute(db.select(User).filter_by(username=username)).scalar_one()
            return user
        except NoResultFound as e:
            print(e)
            print("Users: No username with that name was found.")
            return None

    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one()
            return user
        except NoResultFound as e:
            print(e)
            print("Users: No username with that name was found.")