from typing import List, Dict

from sqlalchemy import update, delete, insert

from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.models import OrderHeader, engine, OrderItems


def insert_order(order_data: List[Dict]) -> int:
    try:
        with engine.connect() as connection:
            result = connection.execute(
                insert(OrderHeader),
                order_data,
            )
            connection.commit()
        order_id = result.lastrowid
        return order_id
    except:
        raise DatabaseError


def insert_items(new_order_items_data: List[Dict]) -> None:
    try:
        with engine.connect() as connection:
            connection.execute(
                insert(OrderItems),
                new_order_items_data,
            )
            connection.commit()
    except:
        raise DatabaseError


def update_shipper_id(order_id: int, shipper_id: int) -> None:
    try:
        update_statement = (
            update(OrderHeader)
            .where(OrderHeader.ORDER_ID == order_id)
            .values(SHIPPER_ID=shipper_id)
        )
        with engine.connect() as connection:
            update_result = connection.execute(update_statement)
            if update_result.rowcount == 0:
                raise NotFoundError
            connection.commit()

    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def update_status(order_id: int, status: str) -> None:
    try:
        update_statement = (
            update(OrderHeader)
            .where(OrderHeader.ORDER_ID == order_id)
            .values(ORDER_STATUS=status)
        )
        with engine.connect() as connection:
            update_result = connection.execute(update_statement)
            if update_result.rowcount == 0:
                raise NotFoundError
            connection.commit()
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def delete_order(order_id: int) -> None:
    try:
        update_statement = (
            update(OrderHeader)
            .where(OrderHeader.ORDER_ID == order_id)
            .values({
                OrderHeader.ORDER_STATUS: 'Cancelled',
                OrderHeader.PAYMENT_MODE: None,
                OrderHeader.PAYMENT_DATE: None
            })
        )
        delete_statement = (
            delete(OrderItems)
            .where(OrderItems.ORDER_ID == order_id)
        )

        with engine.connect() as connection:
            update_result = connection.execute(update_statement)
            if update_result.rowcount == 0:
                raise NotFoundError

            delete_result = connection.execute(delete_statement)
            if delete_result.rowcount == 0:
                raise NotFoundError

            connection.commit()
    except:
        raise DatabaseError
