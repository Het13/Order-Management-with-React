from flask import request, jsonify

from backend.middleware.authorizaton import token_required, roles_required
from backend.middleware.custom_errors import NotFoundError, DatabaseError, LoginError
from backend.middleware.validations import validate_request_body
from backend.users.services import user_services


@validate_request_body(required_fields=['email', 'password'])
def admin_register():
    data = request.get_json()
    role = 'admin'
    try:
        user_services.add(data, role)
        return jsonify({"status": "success", 'message': 'Registered successfully'})
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Error registering user'})


def login_user():
    try:
        token = user_services.login_user()
        return jsonify({"status": "success", 'message': 'Login successful', 'token': token})
    except LoginError:
        return jsonify({"status": "failed", 'message': 'Invalid credentials'})
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'User not found'})
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Login failed'})


@token_required
@roles_required('admin')
@validate_request_body(required_fields=['new_role'])
def change_roles(user_id):
    new_role = request.json.get('new_role')
    if new_role not in ['user', 'admin']:
        return jsonify({"status": "failed", 'message': 'Invalid Role'})

    try:
        user_services.change_roles(new_role, user_id)
        return jsonify({"status": "success", 'message': f'Role updated to {new_role} successfully'})
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'User not found'})
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to update role'})
