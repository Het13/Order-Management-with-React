import {connect} from "react-redux";
import UserDetails from "../components/UserDetails";
import MyOrdersBox from "../components/MyOrdersBox";

function Profile({user, cart}) {
    console.log(user)
    return (<>
        <div className="container mt-4">
            <div className="row g-5">
                <UserDetails
                    user={user}/>
                <MyOrdersBox
                    user={user}
                />
            </div>
        </div>
    </>)
}

const mapStateToProps = (state) => ({
    user: state.user, cart: state.cart.cart
})

export default connect(mapStateToProps)(Profile);