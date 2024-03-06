from typing import Dict

from sqlalchemy import select, func

from backend.middleware.custom_errors import EmptyResult
from backend.models import Product, OrderItems, Carton, engine


def select_optimal_carton(order_id: int) -> Dict[str, int]:
    subquery = (
        select(func.sum(Product.LEN * Product.WIDTH * Product.HEIGHT * OrderItems.PRODUCT_QUANTITY).label('vol'))
        .join_from(Product, OrderItems)
        .where(OrderItems.ORDER_ID == order_id)
        .scalar_subquery()
    )
    query = (
        select(Carton.CARTON_ID, (Carton.LEN * Carton.WIDTH * Carton.HEIGHT).label('CARTON_VOLUME'))
        .where((Carton.LEN * Carton.WIDTH * Carton.HEIGHT) >= subquery)
    )

    with engine.connect() as connection:
        result = connection.execute(query).fetchone()
        if result is None:
            raise EmptyResult
    return result._mapping
