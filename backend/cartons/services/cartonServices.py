from backend.cartons.models.carton_model import select_optimal_carton
from backend.middleware.custom_errors import NotFoundError, DatabaseError, EmptyResult
from backend.orders.models.order_model import select_order


def get_optimal_carton(order_id):
    try:
        order = select_order(int(order_id))

        if order is None:
            raise NotFoundError

        carton = select_optimal_carton(int(order_id))

        carton = {
            'id'    : carton['CARTON_ID'],
            'volume': carton['CARTON_VOLUME']
        }
        return carton

    except EmptyResult:
        raise EmptyResult
    except NotFoundError:
        raise NotFoundError
    except:
        raise DatabaseError
