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


order_set = set()

statement = (
    select(OrderHeader, OrderItems, Product)
    .join(OrderItems, OrderHeader.ORDER_ID == OrderItems.ORDER_ID, isouter=True)
    .join(Product, OrderItems.PRODUCT_ID == Product.PRODUCT_ID, isouter=True)
    .where(OrderHeader.CUSTOMER_ID == 54)
)
with engine.connect() as connection:
    order_data = connection.execute(statement).fetchall()

for x in order_data:
    order_set.add(x)
print(order_set)

attributes = ['order_id', 'customer_id', 'date', 'status', 'payment_mode', 'payment_date', 'shipment_date',
              'shipper_id', 'order_id', 'product_id', 'product_quantity', 'product_id', 'product_desc',
              'product_class_code', 'product_price']
orders = []
for order in order_data:
    row_dict = to_dictionary(attributes=attributes, data=order)
    orders.append(row_dict)

print(orders)
orders_dict = {}
for item in orders:
    order_id = item['order_id']
    if order_id not in orders_dict:
        orders_dict[order_id] = {

            'status'  : item['status'],
            'products': []
        }
        if 'payment_mode' in item:
            orders_dict[order_id]['payment_mode'] = item['payment_mode']
        if 'date' in item:
            orders_dict[order_id]['order_date'] = item['date']
        if 'payment_date' in item:
            orders_dict[order_id]['payment_date'] = item['payment_date']
    if 'product_id' in item:
        orders_dict[order_id]['products'].append({
            'id'      : item['product_id'],
            'name'    : item['product_desc'],
            'quantity': item['product_quantity'],
            'price'   : item['product_price']
        })

orders_list = [{'order_id': k, **v} for k, v in orders_dict.items()]
