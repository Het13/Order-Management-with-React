from flask import jsonify

from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.middleware.validations import validate_request_body
from backend.orders.services import order_services


# @token_required
# @roles_required('user')
@validate_request_body(required_fields=['payment_mode'])
def add_order(id):
    try:
        order_id = order_services.add_order(id)
        return jsonify({"status": "success", 'message': 'Successfully added new order.', 'order_id': order_id}), 200
    except DatabaseError:
        return jsonify({"status": "success", 'message': 'Failed to add order.'})


# @token_required
# @roles_required('user')
@validate_request_body(required_fields=['products'])
def add_items(order_id):
    try:
        order_services.add_items(order_id)
        return jsonify({"status": "success", 'message': 'Successfully added items'}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'Order not found'}), 200
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to add items'})


# @token_required
# @roles_required('admin')
def update_status(order_id):
    try:
        order_services.update_order_status(order_id)
        return jsonify({"status": "success", 'message': 'successfully modified order status'}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': f'Order not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to update order status'})


# @token_required
# @roles_required('admin')
def update_shipper_id(order_id):
    try:
        order_services.update_shipper(order_id)
        return jsonify({"status": "success", 'message': 'Successfully modified shipper_id'}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'Order not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to update shipper id'})


# @token_required
# @roles_required('admin', 'user')
def cancel_order(order_id):
    try:
        order_services.cancel_order(order_id)
        return jsonify({"status": "success", 'message': f'Order cancelled'}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': f'Order not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to cancel order'})
