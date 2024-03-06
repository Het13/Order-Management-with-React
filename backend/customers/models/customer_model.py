from typing import List, Dict, Tuple

from sqlalchemy import insert, select

from backend.middleware.custom_errors import DatabaseError
from backend.models import engine, OnlineCustomer


def insert_customer(data: List[Dict[str, str | int | None]]) -> int:
    try:
        with engine.connect() as connection:
            result = connection.execute(
                insert(OnlineCustomer),
                data,
            )
            connection.commit()
        return result.lastrowid
    except:
        raise DatabaseError


def select_emails() -> List[str]:
    try:
        statement = select(OnlineCustomer.CUSTOMER_EMAIL)
        emails = []
        with engine.connect() as connection:
            for email in connection.execute(statement):
                emails.append(email[0])
        return emails
    except:
        raise DatabaseError


def select_all() -> List[Tuple[str]]:
    try:
        statement = select(OnlineCustomer)
        customers = []
        with engine.connect() as connection:
            for customer in connection.execute(statement):
                customers.append(customer)
        return customers
    except:
        raise DatabaseError


def select_by_id(customer_id: int) -> Tuple[str]:
    try:
        statement = select(OnlineCustomer).where(OnlineCustomer.CUSTOMER_ID == customer_id)
        with engine.connect() as connection:
            customer = connection.execute(statement).fetchone()
        return customer
    except:
        raise DatabaseError
