from backend.address.models.address_models import insert_new_address
from backend.middleware.custom_errors import DatabaseError


def generate_insert_data(address):
    address_line_1 = address['address_line_1']
    address_line_2 = address['address_line_2']
    city = address['city']
    state = address['state']
    pincode = address['pincode']
    country = address['country']

    address_data = [{
        "ADDRESS_LINE1": address_line_1,
        "ADDRESS_LINE2": address_line_2,
        "CITY"         : city,
        "STATE"        : state,
        "PINCODE"      : pincode,
        "COUNTRY"      : country
    }]

    return address_data


def add_address(request_body):
    address_data = generate_insert_data(request_body)
    try:
        address_id = insert_new_address(address_data)
        return address_id
    except:
        raise DatabaseError
