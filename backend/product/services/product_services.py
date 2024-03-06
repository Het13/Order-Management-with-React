from flask import request

from backend.middleware.custom_errors import NotFoundError, DatabaseError
from backend.product.models.product_model import select_categories, select_all_products, select_by_category, \
    select_by_id


def to_dictionary(attributes, data):
    dictionary = {}
    for i, j in zip(attributes, data):
        if j is None:
            continue
        dictionary[i] = j

    return dictionary


def get_all():
    try:
        category = request.args.get('category')
        if category:
            data = select_by_category(category)
        else:
            data = select_all_products()
        if data is None:
            raise NotFoundError

        attributes = ['id', 'product', 'class_code', 'price', 'available_quantity', 'length', 'width',
                      'height', 'weight', 'class_code', 'class']
        products_list = []
        for row in data:
            row_dict = to_dictionary(attributes=attributes, data=row)
            products_list.append(row_dict)

        return products_list

    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def get_by_id(product_id):
    try:
        data = select_by_id(int(product_id))

        if data is None:
            raise NotFoundError

        attributes = ['id', 'product', 'class_code', 'price', 'available_quantity', 'length', 'width',
                      'height', 'weight', 'class_code', 'class']

        product = to_dictionary(attributes=attributes, data=data)
        return product

    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError


def get_categories():
    try:
        data = select_categories()
        categories = []
        for row in data:
            categories.append(row[0])
        return categories
    except:
        raise DatabaseError


def get_by_category():
    return None
