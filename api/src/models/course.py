from src.db.db import db
from sqlalchemy import String, Text, DateTime, desc
from sqlalchemy.exc import NoResultFound, IntegrityError
from sqlalchemy.orm import Mapped, mapped_column
from src.models.base import Base

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(70), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    picture: Mapped[str] = mapped_column(String(100), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=True)
    date_added: Mapped[str] = mapped_column(DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"Course(id={self.id!r}, title={self.title!r}, picture={self.picture!r}, description={self.description!r}, content={self.content!r})"

    @staticmethod
    def get_courses():
        try:
            courses = db.session.execute(db.select(Course)).all()
            return courses
        except NoResultFound as e:
            print(e)
            return None 

    @staticmethod
    def get_courses_with_limit():
        try:
            courses = db.session.execute(db.select(Course).limit(9)).all()
            return courses
        except NoResultFound as e:
            print(e)
            return None
        
    @staticmethod
    def get_course(course_id):
        try:
            course = db.session.execute(db.select(Course).where(Course.id == course_id)).scalar_one()
            return course
        except NoResultFound as e:
            print(e)
            return None
        
    @staticmethod
    def create_course(entry):
        entry = db.session.execute(db.insert(Course).values(title=entry["title"], description=entry["description"], content=entry["content"],  picture=entry["picture"]))
        db.session.commit()
        return entry
    
    @staticmethod
    def edit_course(entry):
        try:
            db.session.execute(db.update(Course).where(Course.id == entry["id"]).values(title=entry["title"], description=entry["description"], content=entry["content"]))
            db.session.commit()
            return True
        except:
            return False
        
    @staticmethod
    def delete_course(entry_id):
        try:
            db.session.execute(db.delete(Course).where(Course.id == entry_id))
            db.session.commit()
            return True
        except:
            return False
