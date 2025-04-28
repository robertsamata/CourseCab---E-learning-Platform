from src.db.db import db
from sqlalchemy import String, Text, DateTime, desc
from sqlalchemy.exc import NoResultFound, IntegrityError
from sqlalchemy.orm import Mapped, mapped_column
from src.models.base import Base
from src.models.course import Course

class AttendedCourse(Base):
    __tablename__ = "attended_courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_course: Mapped[int] = mapped_column(nullable=True)
    id_user: Mapped[int] = mapped_column(nullable=True)
    grade: Mapped[int] = mapped_column(nullable=True)
    date_created: Mapped[str] = mapped_column(DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"AttendedCourse(id={self.id!r}, id_course={self.id_course!r}, id_user={self.id_user!r}, grade={self.grade!r}, date_created={self.date_created!r})"

    @staticmethod
    def get_gradings_for_user(user_id):
        try:
            query = db.session.query(
            AttendedCourse.id,
            AttendedCourse.id_course,
            Course.id,
            AttendedCourse.date_created,
            AttendedCourse.grade,
            Course.title
            ).join(Course, AttendedCourse.id_course == Course.id).filter(AttendedCourse.id_user == user_id)

            results = query.all()
            return results
        except NoResultFound as e:
            print(e)
            return None
        
    @staticmethod
    def create_attended_course(entry):
        entry = db.session.execute(db.insert(AttendedCourse).values(id_course=entry["id_course"], id_user=entry["id_user"], grade=entry["grade"]))
        db.session.commit()
        return entry
    