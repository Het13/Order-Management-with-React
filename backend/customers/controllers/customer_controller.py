from flask import jsonify

from backend.customers.services import customer_services
from backend.middleware.authorizaton import token_required, roles_required
from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.middleware.validations import validate_request_body, check_duplicate_email


@validate_request_body(
    required_fields=['first_name', 'last_name', 'email', 'password', 'phone', 'address', 'username', 'gender'])
@check_duplicate_email()
def add_customer():
    try:
        customer_id = customer_services.add_customer()
        return jsonify({"status": "success", 'message': 'Successfully added customer', 'customer_id': customer_id}), 200
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to add customer'})


@token_required
@roles_required('admin')
def get_by_id(id):
    try:
        customer = customer_services.get_by_id(customer_id=id)
        return jsonify({"status": "success", 'customer': customer}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': f'No customer with id: {id} found'}), 200
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to get customer'})


@token_required
@roles_required('admin')
def get_all():
    try:
        customers = customer_services.get_all()
        return jsonify({"status": "success", 'customers': customers}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'No data found'})
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to get customers'})


@token_required
@roles_required('user', 'admin')
def get_orders(id):
    try:
        orders = customer_services.get_orders(customer_id=id)
        return jsonify({"status": "success", 'orders': orders})
    except NotFoundError:
        return jsonify({"status": "failed", 'message': f'No customer with id: {id} found'})
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to get orders'})
