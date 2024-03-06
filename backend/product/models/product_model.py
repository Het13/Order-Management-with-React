from typing import List

from sqlalchemy import select

from backend.middleware.custom_errors import DatabaseError
from backend.models import engine, ProductClass, Product


def select_all_products() -> List[tuple[str]]:
    try:
        select_statement = (
            select(Product, ProductClass)
            .join_from(Product, ProductClass)
        )

        with engine.connect() as connection:
            result = connection.execute(select_statement)
        return result.fetchall()
    except:
        raise DatabaseError


def select_by_id(id: int) -> List[tuple[str]]:
    try:
        select_statement = (
            select(Product, ProductClass)
            .join_from(Product, ProductClass)
            .where(Product.PRODUCT_ID == id)
        )

        with engine.connect() as connection:
            result = connection.execute(select_statement)
        return result.fetchone()
    except:
        raise DatabaseError


def select_by_category(category: str) -> List[tuple[str]]:
    try:
        select_statement = (
            select(Product, ProductClass)
            .join_from(Product, ProductClass)
            .where(ProductClass.PRODUCT_CLASS_DESC == category)
        )
        with engine.connect() as connection:
            result = connection.execute(select_statement)

        return result.fetchall()
    except:
        raise DatabaseError


def select_categories() -> List[tuple[str]]:
    try:
        select_statement = (
            select(ProductClass.PRODUCT_CLASS_DESC)
        )
        with engine.connect() as connection:
            result = connection.execute(select_statement).fetchall()
        return result
    except:
        raise DatabaseError
