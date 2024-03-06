from functools import wraps
from typing import Callable, Any, Tuple

import jwt
from flask import request, jsonify, Response

from backend.config import SECRET_KEY
from backend.middleware.custom_errors import DatabaseError
from backend.users.services.user_services import get_role


# decorator for validating JWT Token
def token_required(f: Callable[..., Any]) -> Callable[..., Tuple[Response, int]]:
    @wraps(f)
    def decorator(*args: Any, **kwargs: Any) -> Tuple[Response, int]:
        token = None
        if 'Authorization' in request.headers:
            token = request.headers.get('Authorization')
        if not token:
            return jsonify(failed={'message': 'Authorization missing'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify(failed={'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify(failed={'message': 'Invalid token'}), 401
        except:
            return jsonify(error={'error': 'An error occurred'}), 500

        return f(*args, **kwargs)

    return decorator


# decorator for Role Based Authorization
def roles_required(*roles: str) -> Callable[[Callable[..., Tuple[Response, int]]], Callable[..., Tuple[Response, int]]]:
    def wrapper(f: Callable[..., Tuple[Response, int]]) -> Callable[..., Tuple[Response, int]]:
        @wraps(f)
        def decorator(*args: Any, **kwargs: Any) -> Tuple[Response, int]:
            token = request.headers.get('Authorization')
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            email = data['email']
            try:
                role = get_role(email)
                if role not in roles:
                    return jsonify(failed={'message': 'You are not authorized'}), 403
            except DatabaseError:
                return jsonify(failed={'message': 'Authorization Failed'}), 500

            return f(*args, **kwargs)

        return decorator

    return wrapper
