from typing import List, Dict

from sqlalchemy import insert, select

from backend.middleware.custom_errors import DatabaseError
from backend.models import Address, engine


def insert_address(data: List[Dict[str, str]]) -> int:
    try:
        with engine.connect() as connection:
            result = connection.execute(
                insert(Address),
                data,
            )
            connection.commit()
        return result.lastrowid
    except:
        raise DatabaseError


def select_by_id(address_id: int) -> tuple[str]:
    try:
        statement = select(Address).where(Address.ADDRESS_ID == int(address_id))
        with engine.connect() as connection:
            address = connection.execute(statement).fetchone()
        return address
    except:
        raise DatabaseError
