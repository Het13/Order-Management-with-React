from datetime import datetime
from typing import List, Dict

from flask import request

from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.orders.models.order_model import update_status, update_shipper_id, insert_items, insert_order, delete_order


def get_header_attributes(customer_id: int) -> List[Dict[str, str | int | None]]:
    request_body = request.get_json()
    order_date = datetime.now().strftime('%Y-%m-%d')
    order_status = 'In process'
    payment_mode = request_body['payment_mode']
    payment_date = None if payment_mode == 'Cash' else datetime.now().strftime('%Y-%m-%d')
    order_shipment_date = None
    shipper_id = None

    new_order_header_data = [{
        'CUSTOMER_ID'        : customer_id,
        'ORDER_DATE'         : order_date,
        'ORDER_STATUS'       : order_status,
        'PAYMENT_MODE'       : payment_mode,
        'PAYMENT_DATE'       : payment_date,
        'ORDER_SHIPMENT_DATE': order_shipment_date,
        'SHIPPER_ID'         : shipper_id
    }]

    return new_order_header_data


def add_order(customer_id: str) -> int:
    try:
        order_header_data = get_header_attributes(int(customer_id))
        order_id = insert_order(order_header_data)
        return order_id
    except:
        raise DatabaseError


def get_items_attributes(order_id: int) -> List[Dict[str, int]]:
    request_body = request.get_json()
    products = request_body['products']

    new_order_items_data = [{
        'ORDER_ID'        : order_id,
        'PRODUCT_ID'      : product['id'],
        'PRODUCT_QUANTITY': product['quantity']
    } for (product) in products]

    return new_order_items_data


def add_items(order_id: str) -> None:
    try:
        new_order_items_data = get_items_attributes(int(order_id))
        insert_items(new_order_items_data)
    except Exception as e:
        print(e)
        raise DatabaseError


def update_shipper(order_id: str) -> None:
    shipper_id = request.get_json()['id']
    try:
        update_shipper_id(int(order_id), int(shipper_id))
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def update_order_status(order_id: str) -> None:
    order_status = request.get_json()['status']
    try:
        update_status(int(order_id), order_status)
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def cancel_order(order_id: str) -> None:
    try:
        delete_order(int(order_id))
    except NotFoundError:
        raise NotFoundError
    except DatabaseError:
        raise DatabaseError
