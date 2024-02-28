import {connect} from "react-redux";
import UserDetails from "../components/UserDetails";
import CartBox from "../components/CartBox";
import PaymentForm from "../components/PaymentForm";
import axios from "axios";

function Payment({cart, user}) {
    const productsToOrder = cart.map((item) => ({
        "id": item.id,
        "quantity": item.quantity
    }))

    async function placeOrder(data) {
        const customerId = user.customerId
        const header = {
            "Authorization": user.jwtToken,
            'Content-Type': 'application/json'
        }
        console.log(header)

        const headerResponse = await axios.post(
            `/api/v1/customers/${customerId}/orders`,
            {
                "payment_mode": data.paymentMethod
            },
            {
                headers: header
            }
        )
        console.log(headerResponse.data)
        const order_id = headerResponse.data["order_id"]

        const lineItemsResponse = await axios.post(
            `/api/v1/orders/${order_id}/lineitems`,
            {
                "products": productsToOrder
            },
            {
                headers: header
            }
        )
        console.log(lineItemsResponse.data)

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

    </>)
}

const mapStateToProps = (state) => ({
    cart: state.cart.cart, user: state.user
})

export default connect(mapStateToProps)(Payment);