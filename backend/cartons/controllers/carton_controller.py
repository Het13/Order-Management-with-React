from typing import Tuple

from flask import jsonify, Response

from backend.cartons.services.cartonServices import get_optimal_carton
from backend.middleware.authorizaton import token_required, roles_required
from backend.middleware.custom_errors import NotFoundError, DatabaseError, EmptyResult


@token_required
@roles_required('admin')
def optimal_carton(order_id: str) -> Tuple[Response, int]:
    try:
        carton = get_optimal_carton(order_id)
        return jsonify({"status": "success", 'carton': carton}), 200
    except EmptyResult:
        return jsonify({"status": "failed", 'message': 'No optimal carton found'}), 200
    except NotFoundError:
        return jsonify({"status": "failed", 'message': 'Order not found'}), 404
    except DatabaseError:
        return jsonify({"status": "failed", 'message': 'Failed to fetch carton'}), 500
