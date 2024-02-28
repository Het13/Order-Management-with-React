import {connect} from "react-redux";
import UserDetails from "../components/UserDetails";
import CartBox from "../components/CartBox";
import PaymentForm from "../components/PaymentForm";

function Payment({cart, user}) {
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
                <PaymentForm/>
            </div>
        </div>

    </>)
}

const mapStateToProps = (state) => ({
    cart: state.cart.cart, user: state.user
})

export default connect(mapStateToProps)(Payment);