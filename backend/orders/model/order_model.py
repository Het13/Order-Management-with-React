from sqlalchemy import select

from backend.models import OrderHeader, OrderItems, Product, engine


def get_by_customer_id(customer_id):
    statement = (select(OrderHeader, OrderItems, Product)
                 .join_from(OrderHeader, OrderItems)
                 .join_from(OrderItems, Product)
                 .where(OrderHeader.CUSTOMER_ID == int(customer_id)))

    order_data = []
    with engine.connect() as connection:
        for row in connection.execute(statement):
            order_data.append(row)

    return order_data
