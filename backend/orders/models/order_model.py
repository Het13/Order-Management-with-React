from typing import List, Dict, Tuple, Any

from sqlalchemy import update, delete, insert, select

from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.models import OrderHeader, engine, OrderItems, Product


def insert_order(order_data: List[Dict[str, str | int]]) -> int:
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


def insert_items(new_order_items_data: List[Dict[str, str | int]]) -> None:
    try:
        with engine.connect() as connection:
            connection.execute(
                insert(OrderItems),
                new_order_items_data,
            )
            connection.commit()
    except:
        raise DatabaseError


def select_order(order_id: int) -> Tuple[str] | None:
    try:
        select_statement = (
            select(OrderHeader)
            .where(OrderHeader.ORDER_ID == order_id)
        )
        with engine.connect() as connection:
            result = connection.execute(select_statement).fetchone()
        return result
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
                OrderHeader.PAYMENT_DATE: None,
                OrderHeader.SHIPPER_ID  : None
            })
        )
        delete_statement = (
            delete(OrderItems)
            .where(OrderItems.ORDER_ID == order_id)
        )
        print("update", update_statement)
        print("delete", delete_statement)
        with engine.connect() as connection:
            update_result = connection.execute(update_statement)
            if update_result.rowcount == 0:
                raise NotFoundError
            print(update_result.rowcount)
            delete_result = connection.execute(delete_statement)
            if delete_result.rowcount == 0:
                raise NotFoundError

            connection.commit()
    except:
        raise DatabaseError


def select_orders_by_customer_id(customer_id: int) -> List[Tuple[Any]]:
    try:
        statement = (
            select(OrderHeader, OrderItems, Product)
            .join(OrderItems, OrderHeader.ORDER_ID == OrderItems.ORDER_ID, isouter=True)
            .join(Product, OrderItems.PRODUCT_ID == Product.PRODUCT_ID, isouter=True)
            .where(OrderHeader.CUSTOMER_ID == customer_id)
        )
        with engine.connect() as connection:
            orders = connection.execute(statement).fetchall()
            if orders == []:
                raise NotFoundError
        return orders
    except:
        raise DatabaseError
