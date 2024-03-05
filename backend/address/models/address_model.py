from sqlalchemy import insert, select

from backend.models import Address, engine


def insert_address(data):
    with engine.connect() as connection:
        result = connection.execute(
            insert(Address),
            data,
        )
        connection.commit()
    return result.lastrowid


def select_by_id(address_id):
    statement = select(Address).where(Address.ADDRESS_ID == int(address_id))
    with engine.connect() as connection:
        address = connection.execute(statement).fetchone()
    return address
