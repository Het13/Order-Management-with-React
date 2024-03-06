from typing import List, Dict, Union

from sqlalchemy import insert, select, update

from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.models import engine, Users


def insert_user(data: List[Dict]) -> int:
    try:
        with engine.connect() as connection:
            result = connection.execute(
                insert(Users),
                data
            )
            connection.commit()
        return result.lastrowid
    except:
        raise DatabaseError


def select_by_email(email: str) -> Dict[str, Union[str, int]]:
    try:
        select_statement = (
            select(Users)
            .where(Users.email == email)
        )
        with engine.connect() as connection:
            result = connection.execute(select_statement).fetchone()
            print(result)
            if result is None:
                raise NotFoundError
        return result._mapping
    except:
        raise DatabaseError


def update_role(user_id: int, role: str) -> None:
    try:
        update_statement = (
            update(Users)
            .where(Users.id == user_id)
            .values(role=role)
        )
        with engine.connect() as connection:
            result = connection.execute(update_statement)
            if result.rowcount == 0:
                raise NotFoundError
            connection.commit()
    except:
        raise DatabaseError


def select_role(email: str) -> str:
    try:
        select_statement = (
            select(Users.role)
            .where(Users.email == email)
        )
        with engine.connect() as connection:
            result = connection.execute(select_statement).fetchone()
            if result is None:
                raise NotFoundError
        return result[0]
    except:
        raise DatabaseError
