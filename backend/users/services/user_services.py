import datetime
from typing import Dict, List, Tuple

import jwt
from flask import request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.config import SECRET_KEY
from backend.middleware.custom_errors import NotFoundError, DatabaseError, LoginError, MissingAuthentication
from backend.users.models.user_model import insert_user, select_by_email, update_role, select_role


def generate_register_data(data: Dict[str, str], role: str, customer_id=None) -> List[Dict[str, str | int]]:
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


def encode_token(user: str) -> str:
    payload = {
        'exp'  : datetime.datetime.utcnow() + datetime.timedelta(minutes=300),
        'email': user
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def login_user() -> Tuple[str, str, int]:
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        raise MissingAuthentication

    email = auth.username

    try:
        user = select_by_email(email)
        email = user['email']
        customer_id = user['customer_id']
        password = user['password']

        if check_password_hash(password, auth.password):
            token = encode_token(email)
            return token, email, customer_id
        raise LoginError

    except MissingAuthentication:
        raise MissingAuthentication
    except LoginError:
        raise LoginError
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def change_roles(new_role: str, user_id: str) -> None:
    try:
        update_role(int(user_id), new_role)
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def get_role(email: str) -> str:
    try:
        role = select_role(email)
        return role
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError
