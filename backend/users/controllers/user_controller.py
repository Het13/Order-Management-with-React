from typing import Tuple

from flask import request, jsonify, Response

from backend.middleware.authorizaton import token_required, roles_required
from backend.middleware.custom_errors import NotFoundError, DatabaseError, LoginError, MissingAuthentication
from backend.middleware.validations import validate_request_body
from backend.users.services import user_services


@validate_request_body(required_fields=['email', 'password'])
def admin_register() -> Tuple[Response, int]:
    data = request.get_json()
    role = 'admin'
    try:
        user_services.add(data, role)
        return jsonify({"status": "success", 'message': 'Registered successfully'}), 200
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Error registering user'}), 404


def login_user() -> Tuple[Response, int]:
    try:
        token, email, customer_id = user_services.login_user()
        return jsonify({"status": "success", "message": 'Login successful', 'email': email, 'customer_id': customer_id,
                        'token' : token}), 200
    except MissingAuthentication:
        return jsonify({"status": "failed", 'message': 'Missing Authentication credentials'}), 401
    except LoginError:
        return jsonify({"status": "failed", 'message': 'Invalid credentials'}), 401
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'Profile not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Login failed'}), 500


@token_required
@roles_required('admin')
@validate_request_body(required_fields=['new_role'])
def change_roles(user_id: str) -> Tuple[Response, int]:
    new_role = request.json.get('new_role')
    if new_role not in ['user', 'admin']:
        return jsonify({"status": "failed", 'message': 'Invalid Role'}), 200

    try:
        user_services.change_roles(new_role, user_id)
        return jsonify({"status": "success", 'message': f'Role updated to {new_role} successfully'}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'Profile not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to update role'}), 500
