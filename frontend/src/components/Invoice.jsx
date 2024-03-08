import React from 'react';
import axios from "axios";
import {connect} from "react-redux";

const Invoice = ({orderDetails: order, setIsCancelled, user}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toDateString();
    };

    const handleCancel = async (orderId) => {

        const response = await axios.delete(`/api/v1/orders/${orderId}`, {
            headers: {
                'Authorization': user.jwtToken, 'Content-type': 'application/json'
            }
        })
        console.log(response)
        setIsCancelled(true)
    }

    const total = order.products.reduce((total, product) => total + parseFloat(product.price) * product.quantity, 0)

    return (<div className="card">
        <div className="card-header">
            Invoice
        </div>
        <div className="card-body">
            <h5 className="card-title">Order ID: {order['order_id']}</h5>
            {order.status === 'Cancelled' ||
                <>
                    <p className="card-text">Payment Mode: {order.payment_mode}</p>
                    <p className="card-text">Order Date: {formatDate(order.order_date)}</p>
                </>
            }
            {order.payment_date && <p className="card-text">Payment Date: {formatDate(order.payment_date)}</p>}
            <p className="card-text">Status: {order.status}</p>
            {order.status === "In process" &&
                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(order.order_id)}>Cancel</button>
            }
            {order.status === 'Cancelled' ||
                <table className="table table-borderless mt-2">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    {order.products.map((product, index) => (<tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price}</td>
                        <td>{(parseFloat(product.price) * product.quantity).toFixed(2)}</td>
                    </tr>))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="3" className="text-end fw-semibold">Total:</td>
                        <td>
                            {total.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="text-end fw-bold text-success">Discount</td>
                        <td className="text-success">- 5%</td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="text-end fw-bold text-info">Final Amount</td>
                        <td className="text-info">{(total - 0.05 * total).toFixed(2)}</td>
                    </tr>
                    </tfoot>
                </table>}
        </div>
    </div>);
};

const mapStateToProps = (state) => ({
    user: state.user
})
export default connect(mapStateToProps)(Invoice);
