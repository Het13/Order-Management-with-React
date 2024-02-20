import React, {useEffect, useState} from "react";
import axios from "axios";
import Product from "../components/Product";
import DropdownItem from "../components/DropdownItem";
import {connect} from "react-redux";
import {addToCart, removeFromCart} from "../redux/actions";


function ProductCatalogue({cart, addToCart, removeFromCart}) {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("All")
    const [categoryOptions, setCategoryOptions] = useState([]);
    console.log(cart)
    useEffect(() => {
        fetchProducts();
    }, [category])

    useEffect(() => {
        fetchCategories()
    }, []);


    async function fetchCategories() {
        const categories = await axios.get('/api/v1/products/categories')
        setCategoryOptions(categories.data["categories"]);
    }

    async function handleCategoryChange(inputCategory) {
        setCategory(inputCategory)
        await fetchProducts();
    }

    async function fetchProducts() {
        let product;
        if (category === "All") {
            product = await axios.get("/api/v1/products")
        } else {
            product = await axios.get("/api/v1/products", {params: {category: category}})
        }
        setProducts(product.data["products"])
    }


    return (
        <div>
            <div className="container ">
                <select className={"dropdown"} onChange={(e) => handleCategoryChange(e.target.value)}>
                    <option value="All">All</option>
                    {categoryOptions.map((category) => (
                        <DropdownItem key={category.id} title={category}/>
                    ))}
                </select>
                <br/>
                <div className="row gap-4 mx-auto">
                    {products.map((product) => {
                        // console.log(typeof product.id)
                        // console.log(cart)
                        return (
                            <Product
                                id={product.id}
                                key={product.id}
                                name={product.product}
                                product={product}
                                class={product.class}
                                price={product.price}
                                onAdd={addToCart}
                                onRemove={removeFromCart}
                                cart={cart}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    cart: state.cart.cart
})

const mapDispatchToProps = {
    addToCart,
    removeFromCart
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductCatalogue);