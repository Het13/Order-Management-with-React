from flask import jsonify

from backend.middleware.authorizaton import token_required, roles_required
from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.product.services import product_services


@token_required
@roles_required('admin', 'user')
def get_by_id(item_id):
    try:
        product_details = product_services.get_by_id(item_id)
        return jsonify({'status': 'success', 'product': product_details}), 200
    except NotFoundError:
        return jsonify({'status': 'failed', 'message': 'Product not found'}), 200
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get product'})


# @token_required
# @roles_required('admin', 'user')
# @check_product_category()
def get_all():
    try:
        products = product_services.get_all()
        print(products)
        return jsonify({'status': 'success', 'products': products}), 200
    except NotFoundError:
        return jsonify({'status': 'failed', 'message': 'No products found'})
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get products'})


@token_required
@roles_required('admin', 'user')
def get_by_category():
    try:
        products = product_services.get_by_category()
        return jsonify({'status': 'success', 'products': products}), 200
    except NotFoundError:
        return jsonify({'status': 'failed', 'message': 'No products found'})
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get products'})


def get_all_categories():
    try:
        categories = product_services.get_categories()
        return jsonify({'status': 'success', 'categories': categories}), 200
    except DatabaseError:
        return jsonify({'status': 'failed', 'message': 'Failed to get categories'})
