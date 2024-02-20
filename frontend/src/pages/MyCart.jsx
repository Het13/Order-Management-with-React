import React from 'react';
import {connect} from 'react-redux';
import {decreaseQuantity, emptyCart, increaseQuantity, removeFromCart} from '../redux/actions';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = ({cart, removeFromCart, increaseQuantity, decreaseQuantity, emptyCart}) => {
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
                    <button className="btn btn-outline-success btn-sm me-2 ps-2 pe-2 rounded-circle"
                            onClick={() => increaseQuantity(item.id)}>+
                    </button>
                    <button className="btn btn-outline-secondary btn-sm me-2 ps-2 pe-2 rounded-circle"
                            onClick={() => decreaseQuantity(item.id)}>-
                    </button>
                    <button className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item.id)}>{DeleteIcon}
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

            <div className="d-grid d-md-flex justify-content-md-end">
                <button className="btn btn-outline-danger me-md-5"
                        onClick={() => emptyCart()}>EMPTY
                </button>
            </div>
        </div>

    );
};

const mapStateToProps = (state) => ({
    cart: state.cart.cart,
});

const mapDispatchToProps = {
    removeFromCart, increaseQuantity, decreaseQuantity, emptyCart
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
