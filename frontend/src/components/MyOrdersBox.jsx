import {Accordion} from 'react-bootstrap';
import {useEffect, useState} from "react";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

function MyOrdersBox({user}) {

    const customer_id = user.customerId;
    const [orders, setOrders] = useState([])

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
        console.log("order", ordersResponse.data['orders'])
        setOrders(ordersResponse.data['orders'])

    }

    if (orders === []) {
        return <Spinner animation="grow"/>
    }

    const options = {day: '2-digit', month: 'short', year: 'numeric'};

    return (<>
        <div className="col-md-5 col-lg-6 order-md-last">
            <Accordion defaultActiveKey="0">
                {orders.map((order, index) => (<Accordion.Item key={index} eventKey={index.toString()}
                                                               className={order.status === 'Cancelled' ? 'bg-danger' : order.status === 'In process' ? 'bg-primary' : 'bg-success'}>
                    <Accordion.Header>
                        {order.status === 'Cancelled' ? 'Cancelled' : `${order.status} | ${new Date(order.payment_date).toLocaleDateString('en-US', options)}`}

                    </Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            {order.products.map((product, idx) => (<li key={idx}>
                                {product.name} - Quantity: {product.quantity}
                            </li>))}
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>))}
            </Accordion>

        </div>
    </>)
}

export default MyOrdersBox;