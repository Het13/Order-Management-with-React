import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, select
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

load_dotenv('.env')

host = os.getenv("HOST")
user = os.environ.get("USER")
password = os.environ.get("PASSWORD1")
database = os.environ.get("DATABASE")

engine = create_engine(f'mysql+pymysql://{user}:{password}@{host}/{database}')

Base = automap_base()
Base.prepare(autoload_with=engine)
session = Session(engine)

Address = Base.classes.address
Carton = Base.classes.carton
OnlineCustomer = Base.classes.online_customer
OrderHeader = Base.classes.order_header
OrderItems = Base.classes.order_items
Product = Base.classes.product
ProductClass = Base.classes.product_class
Shipper = Base.classes.shipper
Users = Base.classes.users


def to_dictionary(attributes, data):
    dictionary = {}
    for i, j in zip(attributes, data):
        if j is None:
            continue
        dictionary[i] = j

    return dictionary


statement = (select(OrderHeader, OrderItems, Product)
             .join_from(OrderHeader, OrderItems)
             .join_from(OrderItems, Product)
             .where(OrderHeader.CUSTOMER_ID == 1))

order_data = []
with engine.connect() as connection:
    for row in connection.execute(statement):
        order_data.append(row)
