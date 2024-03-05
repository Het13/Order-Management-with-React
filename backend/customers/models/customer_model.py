from sqlalchemy import insert, select

from backend.models import engine, OnlineCustomer


def insert_customer(data):
    with engine.connect() as connection:
        result = connection.execute(
            insert(OnlineCustomer),
            data,
        )
        connection.commit()
    return result.lastrowid


def select_emails():
    statement = select(OnlineCustomer.CUSTOMER_EMAIL)
    emails = []
    with engine.connect() as connection:
        for email in connection.execute(statement):
            emails.append(email[0])
    return emails


def select_all():
    statement = select(OnlineCustomer)
    customers = []
    with engine.connect() as connection:
        for customer in connection.execute(statement):
            customers.append(customer)
    return customers


def select_by_id(customer_id):
    statement = select(OnlineCustomer).where(OnlineCustomer.CUSTOMER_ID == int(customer_id))
    with engine.connect() as connection:
        customer = connection.execute(statement).fetchone()
    return customer
