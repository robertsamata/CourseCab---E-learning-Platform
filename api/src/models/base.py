from sqlalchemy.inspection import inspect
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase): 
    @staticmethod 
    def orm_to_dict(orm_instance):
        return {c.key: getattr(orm_instance, c.key)
            for c in inspect(orm_instance).mapper.column_attrs}

    pass