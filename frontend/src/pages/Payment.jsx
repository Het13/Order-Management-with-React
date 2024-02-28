import {connect} from "react-redux";
import UserDetails from "../components/UserDetails";
import CartBox from "../components/CartBox";
import PaymentForm from "../components/PaymentForm";
import {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Payment({cart, user}) {

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true);

    const navigate = useNavigate()

    const productsToOrder = cart.map((item) => ({
        "id": item.id, "quantity": item.quantity
    }))

    async function placeOrder(data) {
        const customerId = user.customerId
        const header = {
            "Authorization": user.jwtToken, 'Content-Type': 'application/json'
        }
        console.log(header)

        const headerResponse = await axios.post(`/api/v1/customers/${customerId}/orders`, {
            "payment_mode": data.paymentMethod
        }, {
            headers: header
        })
        console.log(headerResponse.data)
        const order_id = headerResponse.data["order_id"]

        const lineItemsResponse = await axios.post(`/api/v1/orders/${order_id}/lineitems`, {
            "products": productsToOrder
        }, {
            headers: header
        })
        console.log(lineItemsResponse.data)
        handleShow()
    }

    function handleRedirect() {
        navigate('/')
    }

    return (<>
        <div className="container p-5">
            <div className="row g-5">
                <CartBox
                    cart={cart}
                />
                <UserDetails
                    user={user}
                />
            </div>

            <div className="mt-5">
                <PaymentForm
                    onPlaceOrder={placeOrder}
                />
            </div>
        </div>

        <Modal show={show}>
            <Modal.Header>
                <Modal.Title>Order Placed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Woohoo, your order is placed successfully!
                Order details are sent to {user.name}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleRedirect}>
                    Proceed
                </Button>
            </Modal.Footer>
        </Modal>

    </>)
}

const mapStateToProps = (state) => ({
    cart: state.cart.cart, user: state.user
})

export default connect(mapStateToProps)(Payment);