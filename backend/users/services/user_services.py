import datetime

import jwt
from flask import request, jsonify
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from backend.config import SECRET_KEY
from backend.middleware.custom_errors import NotFoundError, DatabaseError, LoginError
from backend.users.models.user_model import insert_user, select_by_email, update_role, select_role


def generate_register_data(data, role, customer_id=None):
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    register_data = [{
        'email'      : data['email'],
        'password'   : hashed_password,
        'role'       : role,
        'customer_id': customer_id
    }]

    return register_data


def add(data, role, customer_id=None):
    register_data = generate_register_data(data, role, customer_id)

    try:
        user_id = insert_user(register_data)
    except:
        raise DatabaseError


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
        return jsonify({"status": "failed", 'message': 'Could not verify'})

    email = auth.username

    try:
        user = select_by_email(email)
        email = user['email']
        customer_id = user['customer_id']
        password = user['password']

        if check_password_hash(password, auth.password):
            print('valid')
            token = encode_token(email)
            return token, email, customer_id
        raise LoginError

    except LoginError:
        raise LoginError
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def change_roles(new_role, user_id):
    try:
        update_role(int(user_id), new_role)
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def get_role(email):
    try:
        role = select_role(email)
        return role
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError
