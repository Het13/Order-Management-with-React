import datetime

import jwt
from flask import request, jsonify
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from backend.config import SECRET_KEY
from backend.database_connection import connection_pool
from backend.middleware.custom_errors import NotFoundError, DatabaseError, LoginError


def add(data, role):
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()
    try:
        query = 'INSERT INTO USERS(EMAIL,PASSWORD,ROLE) VALUES(%s,%s,%s)'
        database_cursor.execute(query, (data['email'], hashed_password, role))
        connection.commit()
    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()


def encode_token(user):
    payload = {
        'exp'  : datetime.datetime.utcnow() + datetime.timedelta(minutes=300),
        'email': user
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    print(token)
    return token


def login_user():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return jsonify({'message': 'Could not verify'})

    user = auth.username

    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()

    try:
        query = 'SELECT EMAIL,PASSWORD,CUSTOMER_ID FROM USERS WHERE EMAIL = %s'
        database_cursor.execute(query, (user,))
        result = database_cursor.fetchone()
        if result is None:
            raise NotFoundError
        else:
            email = result[0]
            password = result[1]
            customer_id = result[2]

        if check_password_hash(password, auth.password):
            token = encode_token(user)
            return token, email, customer_id
        raise LoginError

    except LoginError:
        raise LoginError
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()


def change_roles(new_role, user_id):
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()

    try:
        query = 'UPDATE USERS SET ROLE=%s WHERE ID=%s'
        database_cursor.execute(query, (new_role, user_id))
        if database_cursor.rowcount == 0:
            raise NotFoundError
        connection.commit()
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()


def get_role(email):
    connection = connection_pool.get_connection()
    database_cursor = connection.cursor()

    try:
        query = 'SELECT ROLE FROM USERS WHERE EMAIL=%s'

        database_cursor.execute(query, (email,))

        return database_cursor.fetchone()[0]
    except:
        raise DatabaseError
    finally:
        database_cursor.close()
        connection.close()
