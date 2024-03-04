import {useEffect, useState} from "react";
import axios from "axios";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {Accordion} from "react-bootstrap";

function MyOrdersBox({user}) {

    const customer_id = user.customerId;
    const [orders, setOrders] = useState(null)

    useEffect(() => {
        getOrders();
    }, []);

    console.log("")

    async function getOrders() {
        const ordersResponse = await axios.get(`/api/v1/customers/${customer_id}/orders`, {
            headers: {
                'Authorization': user.jwtToken, 'Content-type': 'application/json'
            }
        })
        let customerOrders = ordersResponse.data['orders'].sort((item1, item2) => item2['order_id'] - item1['order_id'])
        setOrders(customerOrders)

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
            <Accordion>
                {(orders.map((order, index) => (<Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>
                        {(order.status === 'Cancelled' ? 'Cancelled' : `${order.status} | ${new Date(order.payment_date).toLocaleDateString('en-US', options)}`)}
                    </Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            {(order.products.map((product, idx) => (<li key={idx}>
                                {product.name} - Quantity: {product.quantity}
                            </li>)))}
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>))) || <Skeleton count={5}/>}
            </Accordion>
        </div>

    </>)
}

export default MyOrdersBox;