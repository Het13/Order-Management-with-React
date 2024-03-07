import React from 'react';
import {connect} from 'react-redux';
import {decreaseQuantity, emptyCart, increaseQuantity, removeFromCart} from '../redux/actions/actions';
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate} from "react-router-dom";
import {Flip, toast} from 'react-toastify';

const Cart = ({user, cart, removeFromCart, increaseQuantity, decreaseQuantity, emptyCart}) => {
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const navigate = useNavigate()
    const onCheckout = () => {
        if (user.isAuthenticated) {
            navigate('/payment')
        } else {
            toast.warning("Login First ! ", {
                position: "bottom-center", theme: "colored", transition: Flip, autoClose: 3000
            });
        }
    }

    const handleEmptyCart = () => {
        toast.success("Cart Emptied!", {
            position: "bottom-center", theme: "colored", transition: Flip, autoClose: 4000
        })
        navigate('/')
        emptyCart()
    }

    const handleDecreaseCart = (itemId) => {
        // decreaseQuantity(itemId)
        cart.forEach((item) => {
            if (item.id === itemId && item.quantity === 1) {
                removeFromCart(itemId);
            } else {
                decreaseQuantity(itemId);
            }
        });
    }
    if (cart.length === 0) {
        return (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
            EMPTY
        </div>)
    }
    return (<div className="container">
            <h2>Shopping Cart</h2>
            <div className="row mt-5 mb-3">
                <div className="col-md-4">
                    <h5>Product</h5>
                </div>
                <div className="col-md-2">
                    <h5>Price</h5>
                </div>
                <div className="col-md-2">
                    <h5>Quantity</h5>
                </div>
                <div className="col-md-2">
                    <h5>Amount</h5>
                </div>
                <div className="col-md-2">
                    <h5>Action</h5>
                </div>
            </div>
            {cart.map((item) => (<div className="row m-2" key={item.id}>
                <div className="col-md-4">{item.product}</div>
                <div className="col-md-2">${item.price}</div>
                <div className="col-md-2">{item.quantity}</div>
                <div className="col-md-2">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="col-md-2">
                    <button className="btn btn-outline-success btn-sm me-2 ps-2 pe-2 "
                            onClick={() => increaseQuantity(item.id)}>+
                    </button>
                    <button className="btn btn-outline-secondary btn-sm me-2 ps-2 pe-2"
                            onClick={() => handleDecreaseCart(item.id)}>-
                    </button>
                    <button className="btn btn-outline-danger btn-sm "
                            onClick={() => removeFromCart(item.id)}><DeleteIcon/>
                    </button>
                </div>


            </div>))}
            <div className="row mt-3">
                <div className="col-md-6"></div>
                <div className="col-md-2">
                    <h5>Total:</h5>
                </div>
                <div className="col-md-2">
                    <h5>${totalAmount.toFixed(2)}</h5>
                </div>
                <div className="col-md-2"></div>
            </div>

            <div className="d-grid d-md-flex justify-content-md-end me-5">
                <button className="btn btn-outline-danger me-md-5"
                        onClick={handleEmptyCart}>EMPTY
                </button>
            </div>
            <div className="d-grid d-md-flex justify-content-md-center ">
                <button className="btn btn-outline-success me-md-5"
                        onClick={onCheckout}>Proceed to Checkout
                </button>
            </div>

        </div>

    );
};

const mapStateToProps = (state) => ({
    cart: state.cart.cart, user: state.user
});

const mapDispatchToProps = {
    removeFromCart, increaseQuantity, decreaseQuantity, emptyCart
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
