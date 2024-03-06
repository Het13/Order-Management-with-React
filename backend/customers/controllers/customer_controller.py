from typing import Tuple

from flask import jsonify, Response

from backend.customers.services import customer_services
from backend.middleware.authorizaton import token_required, roles_required
from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.middleware.validations import validate_request_body, check_duplicate_email


@validate_request_body(
    required_fields=['first_name', 'last_name', 'email', 'password', 'phone', 'address', 'username', 'gender'])
@check_duplicate_email()
def add_customer() -> Tuple[Response, int]:
    try:
        customer_id = customer_services.add_customer()
        return jsonify({"status": "success", 'message': 'Successfully added customer', 'customer_id': customer_id}), 200
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to add customer'}), 500


@token_required
@roles_required('admin', 'user')
def get_by_id(id: str) -> Tuple[Response, int]:
    try:
        customer = customer_services.get_by_id(customer_id=id)
        return jsonify({"status": "success", 'customer': customer}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': f'No customer with id: {id} found'}), 200
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to get customer'}), 500


@token_required
@roles_required('admin')
def get_all() -> Tuple[Response, int]:
    try:
        customers = customer_services.get_all()
        return jsonify({"status": "success", 'customers': customers}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'No data found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to get customers'}), 500


@token_required
@roles_required('user', 'admin')
def get_orders(id: str) -> Tuple[Response, int]:
    try:
        orders = customer_services.get_orders(customer_id=id)
        return jsonify({"status": "success", 'orders': orders}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'Customer not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to get orders'}), 404
