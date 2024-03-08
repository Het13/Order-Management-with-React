import {useEffect, useState} from "react";
import MyOrdersBox from "../components/MyOrdersBox";
import Invoice from "../components/Invoice";
import axios from "axios";
import {connect} from "react-redux";

const MyOrders = ({user}) => {

    const [isOrder, setIsOrder] = useState(false)
    const [order, setOrder] = useState(null)
    const [isCancelled, setIsCancelled] = useState(false)

    const customer_id = user.customerId;
    const [orders, setOrders] = useState(null)

    useEffect(() => {
        getOrders();
    }, [isCancelled]);


    async function getOrders() {
        try {
            const ordersResponse = await axios.get(`/api/v1/customers/${customer_id}/orders`, {
                headers: {
                    'Authorization': user.jwtToken, 'Content-type': 'application/json'
                }
            })
            let customerOrders = ordersResponse.data['orders'].sort((item1, item2) => item2['order_id'] - item1['order_id'])
            const ordersWithAmountPaid = customerOrders.map(order => {
                const amountPaid = order.products.reduce((total, product) => {
                    return total + (product.price * product.quantity);
                }, 0);
                return {...order, amount_paid: amountPaid};
            });
            setOrders(ordersWithAmountPaid)
            console.log(ordersWithAmountPaid)
        } catch {
            setOrders({})
        } finally {
            setIsCancelled(false)
            setIsOrder(false)
        }
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-3">My Orders</h3>
            <div className="row">
                <div className="col-md-7 col-lg-6 fs-5">
                    <MyOrdersBox
                        handleSetIsOrder={setIsOrder}
                        handleSetOrder={setOrder}
                        orders={orders}
                    />
                </div>
                {isOrder &&
                    <div className="col-md-5 col-lg-6 order-md-last ">
                        <Invoice
                            orderDetails={order}
                            setIsCancelled={setIsCancelled}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(MyOrders);