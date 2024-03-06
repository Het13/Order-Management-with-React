from flask import jsonify

from backend.cartons.services.cartonServices import get_optimal_carton
from backend.middleware.custom_errors import NotFoundError, DatabaseError, EmptyResult


# @token_required
# @roles_required('admin')
def optimal_carton(order_id):
    try:
        carton = get_optimal_carton(order_id)
        return jsonify({"status": "success", 'carton': {'id': carton['id'], 'volume': carton['volume']}}), 200
    except EmptyResult:
        return jsonify({"status": "failed", 'message': 'No optimal carton found'}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'Order not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to fetch carton'})
