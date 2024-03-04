import {useEffect, useState} from "react";
import axios from "axios";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function MyOrdersBox({user}) {

    const customer_id = user.customerId;
    const [orders, setOrders] = useState(null)

    useEffect(() => {
        getOrders();
    }, []);


    async function getOrders() {
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
        console.log(orders)
    }

    if (orders === null) {
        return (<div className="col-md-5 col-lg-6 order-md-last">
            <h3 className="mb-3">My Orders</h3>
            <SkeletonTheme baseColor="grey" highlightColor="#444" height={60}>
                <Skeleton count={7}/>
            </SkeletonTheme>
        </div>)
    }

    const options = {day: '2-digit', month: 'short', year: 'numeric'};


    return (<>
        <div className="col-md-5 col-lg-6 order-md-last">
            <h3 className="mb-3">My Orders</h3>
            <div className="accordion my-order-accordian" id="accordionExample">
                {orders.map((order, index) => (
                    <div className="accordion-item" key={index}>
                        <h2 className="accordion-header" id={`heading-${index}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${index}`}
                                aria-expanded="false"
                                aria-controls={`collapse-${index}`}
                            >
                                <div className="container">
                                    <div className="row"
                                         style={{
                                             color:
                                                 order.status === 'In process' ? 'dodgerblue' : order.status === 'Shipped' ? 'lightgreen' : 'orangered',
                                         }}>
                                        <div className="col">{order.status}</div>
                                        <div className="col">Rs. {order.amount_paid.toFixed(2)}</div>
                                        <div className="col">
                                            {order.status === 'Cancelled' ||
                                                new Date(order.payment_date).toLocaleDateString(
                                                    'en-US',
                                                    options
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#accordionExample"

                        >
                            <div className="accordion-body">
                                <ul>
                                    {order.products.map((product, idx) => (
                                        <li key={idx}>
                                            {product.name} - Quantity: {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    </>)
}

// #441010
// 031633
/*#094908*/
export default MyOrdersBox;