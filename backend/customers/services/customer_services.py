from datetime import datetime

from flask import request

from backend.address.services import address_services
from backend.database_connection import connection_pool
from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.users.services import user_services


def get_email():
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()

    try:
        query = 'SELECT CUSTOMER_EMAIL FROM ONLINE_CUSTOMER'

        database_cursor.execute(query)
        emails = []
        for row in database_cursor.fetchall():
            emails.append(row[0])
        return emails
    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()


def to_dictionary(attributes, data):
    dictionary = {}
    for i, j in zip(attributes, data):
        if j is None:
            continue
        dictionary[i] = j

    return dictionary


def get_all():
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()

    try:
        query = 'SELECT * FROM ONLINE_CUSTOMER'

        database_cursor.execute(query)
        data = database_cursor.fetchall()

        if data is None:
            raise NotFoundError

        attributes = ['id', 'first_name', 'last_name', 'email', 'phone', 'address_id', 'creation_date', 'username',
                      'gender']
        customers_list = []
        for row in data:
            row_dict = to_dictionary(attributes=attributes, data=row)
            customers_list.append(row_dict)

        return customers_list
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()


def get_by_id(customer_id):
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()

    try:
        query = 'SELECT * FROM ONLINE_CUSTOMER JOIN address ON online_customer.ADDRESS_ID = address.ADDRESS_ID WHERE CUSTOMER_ID = %s'

        database_cursor.execute(query, (customer_id,))
        customer_data = database_cursor.fetchone()
        if customer_data is None:
            raise NotFoundError

        attributes = ['id', 'first_name', 'last_name', 'email', 'phone', 'address_id', 'creation_date', 'username',
                      'gender', 'address_id', 'address_line_1', 'address_line_2', 'city', 'state', 'pincode', 'country']

        customer = {}
        for i, j in zip(attributes, customer_data):
            if j is None:
                continue
            customer[i] = j

        print(customer)
        return customer
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()


def get_orders(customer_id):
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()

    try:
        get_order_query = "select * from order_header join orders.order_items oi on order_header.ORDER_ID = oi.ORDER_ID join orders.product p on oi.PRODUCT_ID = p.PRODUCT_ID where CUSTOMER_ID=%s;"
        database_cursor.execute(get_order_query, (customer_id,))
        order_data = database_cursor.fetchall()

        attributes = ['order_id', 'customer_id', 'date', 'status', 'payment_mode', 'payment_date', 'shipment_date',
                      'shipper_id', 'order_id', 'product_id', 'product_quantity', 'product_id', 'product_desc',
                      'oroduct_class_code', 'product_price']
        orders = []
        for row in order_data:
            row_dict = to_dictionary(attributes=attributes, data=row)
            orders.append(row_dict)

        print(orders)
        if orders == []:
            raise NotFoundError

        orders_dict = {}
        for item in orders:
            order_id = item['order_id']
            if order_id not in orders_dict:
                orders_dict[order_id] = {
                    'payment_mode': item['payment_mode'],
                    'status'      : item['status'],
                    'products'    : []
                }
                if 'payment_date' in item:
                    orders_dict[order_id]['payment_date'] = item['payment_date']
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
    finally:
        database_cursor.close()
        connection.close()


def get_address_id(address_data):
    try:
        address_id = address_services.add_address(address_data)
        return address_id
    except:
        raise DatabaseError


def get_attributes(request_body):
    first_name = request_body['first_name']
    last_name = request_body['last_name']
    email = request_body['email']
    phone = request_body['phone']
    address = request_body['address']
    creation_date = datetime.today().strftime('%Y-%m-%d')
    username = request_body['username']
    gender = request_body['gender']

    address_line_1 = address['address_line_1']
    address_line_2 = address['address_line_2']
    city = address['city']
    state = address['state']
    pincode = address['pincode']
    country = address['country']

    address_data = (
        address_line_1,
        address_line_2,
        city,
        state,
        pincode,
        country
    )
    try:
        address_id = get_address_id(address_data)
        new_customer_data = (
            first_name,
            last_name,
            email,
            phone,
            address_id,
            creation_date,
            username,
            gender
        )
        return new_customer_data
    except DatabaseError:
        raise DatabaseError


def add_customer():
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()
    request_body = request.get_json()
    try:
        new_customer_insert_statement = "INSERT INTO ONLINE_CUSTOMER (CUSTOMER_FNAME,CUSTOMER_LNAME,CUSTOMER_EMAIL, " \
                                        "CUSTOMER_PHONE,ADDRESS_ID,CUSTOMER_CREATION_DATE,CUSTOMER_USERNAME," \
                                        "CUSTOMER_GENDER)  VALUES(%s,%s,%s,%s,%s,%s,%s,%s)"

        new_customer_data = get_attributes(request_body)
        database_cursor.execute(new_customer_insert_statement, new_customer_data)

        customer_id = database_cursor.lastrowid

        email = request_body['email']
        password = request_body['password']

        data = {'email': email, 'password': password}
        user_services.add(data, role='user')

        connection.commit()
        return customer_id

    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()
