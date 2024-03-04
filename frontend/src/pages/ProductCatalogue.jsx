import React, {useEffect, useState} from "react";
import axios from "axios";
import DropdownItem from "../components/DropdownItem";
import {connect} from "react-redux";
import {addToCart, removeFromCart} from "../redux/actions/actions";
import Product from "../components/Product";
import ProductPageLoading from "../components/ProductPageLoading";


function ProductCatalogue({user, cart, addToCart, removeFromCart}) {

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("All")
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingProducts, setLoadingProducts] = useState(true)

    useEffect(() => {
        fetchProducts();
    }, [category])

    useEffect(() => {
        fetchCategories()
    }, []);


    async function fetchCategories() {
        const categories = await axios.get('/api/v1/products/categories')
        setCategoryOptions(categories.data["categories"]);
        setLoadingPage(false)
    }

    async function handleCategoryChange(inputCategory) {
        setCategory(inputCategory)
        setLoadingProducts(true)
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
        setLoadingProducts(false)
    }

    if (loadingPage) {
        return <ProductPageLoading/>
    }

    return (<div className="container ">
        <select className={"dropdown"} onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="All">All</option>
            {categoryOptions.map((category) => (<DropdownItem key={category.id} title={category}/>))}
        </select>
        <br/>
        {!loadingProducts ? <div className="row gap-4 mx-auto">
            {products.map((product) => {
                return (<Product
                    id={product.id}
                    key={product.id}
                    name={product.product}
                    product={product}
                    class={product.class}
                    price={product.price}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                    cart={cart}
                    user={user}
                />)
            })}
        </div> : <ProductPageLoading/>}
    </div>)
}

const mapStateToProps = (state) => ({
    cart: state.cart.cart, user: state.user
})

const mapDispatchToProps = {
    addToCart, removeFromCart
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductCatalogue);