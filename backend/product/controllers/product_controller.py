from typing import Tuple

from flask import jsonify, Response

from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.middleware.validations import check_product_category
from backend.product.services import product_services


def get_by_id(item_id: str) -> Tuple[Response, int]:
    try:
        product_details = product_services.get_by_id(item_id)
        print(product_details)
        return jsonify({'status': 'success', 'product': product_details}), 200
    except NotFoundError:
        return jsonify({'status': 'failed', 'message': 'Product not found'}), 200
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get product'}), 500


@check_product_category()
def get_all() -> Tuple[Response, int]:
    try:
        products = product_services.get_all()
        return jsonify({'status': 'success', 'products': products}), 200
    except NotFoundError:
        return jsonify({'status': 'failed', 'message': 'No products found'}), 404
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get products'}), 500


def get_by_category() -> Tuple[Response, int]:
    try:
        products = product_services.get_by_category()
        return jsonify({'status': 'success', 'products': products}), 200
    except NotFoundError:
        return jsonify({'status': 'failed', 'message': 'No products found'}), 404
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get products'}), 500


def get_all_categories() -> Tuple[Response, int]:
    try:
        categories = product_services.get_categories()
        return jsonify({'status': 'success', 'categories': categories}), 200
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get categories'}), 500
