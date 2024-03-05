from sqlalchemy import insert

from backend.models import Address, engine


def insert_new_address(data):
    with engine.connect() as connection:
        result = connection.execute(
            insert(Address),
            data,
        )
        connection.commit()
    return result.lastrowid
