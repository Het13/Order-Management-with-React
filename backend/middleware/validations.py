from functools import wraps
from typing import List, Callable, Tuple, Any

from flask import request, jsonify, Response

from backend.customers.services.customer_services import get_email
from backend.product.services.product_services import get_categories


def validate_request_body(required_fields: List[str]) \
        -> Callable[[Callable[..., Response]], Callable[..., Tuple[Response, int]]]:
    def decorator(f: Callable[..., Response]) -> Callable[..., Tuple[Response, int]]:
        @wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> Tuple[Response, int] | Response:
            if not request.is_json:
                return jsonify({"status": "failed", "message": 'Invalid request type'}), 400

            request_body = request.get_json()
            for field in required_fields:
                if field not in request_body or request_body[field] == "":
                    return jsonify({"status": "failed", 'message': 'Empty Fields'}), 400

            return f(*args, **kwargs)

        return wrapper

    return decorator


def check_product_category() -> Callable[[Callable[..., Response]], Callable[..., Tuple[Response, int]]]:
    def decorator(f: Callable[..., Response]) -> Callable[..., Tuple[Response, int]]:
        @wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> Response | Tuple[Response, int]:
            try:
                if not request.args.get('category'):
                    return f(*args, **kwargs)

                category = request.args.get('category')
                if category not in get_categories():
                    return jsonify({"status": "failed", 'message': 'No such category found'}), 404
                print('cat verified')
                return f(*args, **kwargs)
            except:
                return jsonify({"status": "failed", 'message': 'Some error occurred'}), 500

        return wrapper

    return decorator


def check_duplicate_email() -> Callable[[Callable[..., Response]], Callable[..., Tuple[Response, int]]]:
    def decorator(f: Callable[..., Response]) -> Callable[..., Tuple[Response, int]]:
        @wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> Response | Tuple[Response, int]:
            try:
                request_body = request.get_json()
                if request_body['email'] in get_email():
                    return jsonify({"status": "failed", 'message': 'Duplicate email'}), 200
                return f(*args, **kwargs)
            except:
                return jsonify({"status": "failed", 'message': 'Some error occurred'}), 500

        return wrapper

    return decorator
