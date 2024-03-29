from datetime import datetime
from typing import List, Dict, Any

from flask import request

from backend.address.models import address_model
from backend.address.services import address_services
from backend.customers.models.customer_model import insert_customer, select_emails, select_all, select_by_id
from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.orders.models.order_model import select_orders_by_customer_id
from backend.users.services import user_services


def get_email() -> List[str]:
    try:
        emails = select_emails()
        return emails
    except:
        raise DatabaseError


def to_dictionary(attributes: List[str], data) -> Dict[str, Any]:
    dictionary = {}
    for i, j in zip(attributes, data):
        if j is None:
            continue
        dictionary[i] = j

    return dictionary


def get_all() -> List[Dict[str, str | int]]:
    try:
        customers = select_all()
        if customers == []:
            raise NotFoundError

        attributes = ['id', 'first_name', 'last_name', 'email', 'phone', 'address_id', 'creation_date', 'username',
                      'gender']
        customers_list = []
        for row in customers:
            row_dict = to_dictionary(attributes=attributes, data=row)
            customers_list.append(row_dict)

        return customers_list
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def get_by_id(customer_id: str) -> Dict[str, str | int]:
    try:
        customer_data = select_by_id(int(customer_id))
        if customer_data is None:
            raise NotFoundError

        customer_attributes = ['id', 'first_name', 'last_name', 'email', 'phone', 'address_id', 'creation_date',
                               'username', 'gender']
        customer = to_dictionary(customer_attributes, data=customer_data)

        address_id = customer['address_id']
        address_data = address_model.select_by_id(int(address_id))
        if address_data is None:
            raise NotFoundError

        address_attributes = ['address_id', 'address_line_1', 'address_line_2', 'city', 'state', 'pincode', 'country']
        address = to_dictionary(address_attributes, address_data)

        return {**customer, **address}

    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def get_orders(customer_id: str) -> List[Dict[str, Any]]:
    try:
        order_data = select_orders_by_customer_id(int(customer_id))

        attributes = ['order_id', 'customer_id', 'date', 'status', 'payment_mode', 'payment_date', 'shipment_date',
                      'shipper_id', 'order_id', 'product_id', 'product_quantity', 'product_id', 'product_desc',
                      'product_class_code', 'product_price']
        orders = []
        for order in order_data:
            row_dict = to_dictionary(attributes=attributes, data=order)
            orders.append(row_dict)

        orders_dict = {}
        for item in orders:
            order_id = item['order_id']
            if order_id not in orders_dict:
                orders_dict[order_id] = {
                    'status'  : item['status'],
                    'products': []
                }

                if 'payment_mode' in item:
                    orders_dict[order_id]['payment_mode'] = item['payment_mode']
                if 'date' in item:
                    orders_dict[order_id]['order_date'] = item['date']
                if 'payment_date' in item:
                    orders_dict[order_id]['payment_date'] = item['payment_date']
            if 'product_id' in item:
                orders_dict[order_id]['products'].append({
                    'id'      : item['product_id'],
                    'name'    : item['product_desc'],
                    'quantity': item['product_quantity'],
                    'price'   : item['product_price']
                })

        orders_list = [{'order_id': k, **v} for k, v in orders_dict.items()]
        return orders_list
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def get_address_id(address: List[Dict[str, str]]) -> int:
    try:
        address_id = address_services.add_address(address)
        return address_id
    except:
        raise DatabaseError


def get_attributes(request_body: Dict[str, Any]) -> list[dict[str, str | int]]:
    first_name = request_body['first_name']
    last_name = request_body['last_name']
    email = request_body['email']
    phone = request_body['phone']
    address = request_body['address']
    creation_date = datetime.today().strftime('%Y-%m-%d')
    username = request_body['username']
    gender = request_body['gender']

    try:
        address_id = get_address_id(address)
        new_customer_data = [{
            'CUSTOMER_FNAME'        : first_name,
            'CUSTOMER_LNAME'        : last_name,
            'CUSTOMER_EMAIL'        : email,
            'CUSTOMER_PHONE'        : phone,
            'ADDRESS_ID'            : address_id,
            'CUSTOMER_CREATION_DATE': creation_date,
            'CUSTOMER_USERNAME'     : username,
            'CUSTOMER_GENDER'       : gender
        }]
        return new_customer_data
    except DatabaseError:
        raise DatabaseError


def add_customer() -> int:
    request_body = request.get_json()
    try:
        new_customer_data = get_attributes(request_body)

        customer_id = insert_customer(data=new_customer_data)

        email = request_body['email']
        password = request_body['password']

        user_data = {'email': email, 'password': password}
        user_services.add(data=user_data, role='user', customer_id=customer_id)
        return customer_id

    except:
        raise DatabaseError
