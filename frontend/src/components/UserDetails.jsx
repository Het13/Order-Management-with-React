import axios from "axios";
import {useEffect, useState} from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {connect} from "react-redux";

const UserDetails = ({user}) => {

    const [customerData, setCustomerData] = useState(null)

    const customer_id = user.customerId

    useEffect(() => {
        getCustomerData();
    }, []);

    async function getCustomerData() {
        try {
            const response = await axios.get(`/api/v1/customers/${customer_id}`, {
                headers: {
                    "Authorization": user.jwtToken, 'Content-Type': 'application/json'
                }
            })
            console.log(response.data.customer)
            setCustomerData(response.data.customer)
        } catch (e) {
            console.log(e)
        }
    }

    if (customerData === null) {
        return (<>
            <h3 className="mb-3">My Details</h3>
            <SkeletonTheme inline={true}>
                <SkeletonTheme baseColor="grey" highlightColor="#444" height={30}>
                    <Skeleton count={7}/>
                </SkeletonTheme>

            </SkeletonTheme>
        </>)

    }
    return (<>
        <h3 className="mb-3">My Details</h3>
        <div className="row">
            <div className="col-5">
                Email
            </div>
            <div className="col">
                {customerData.email || <Skeleton count={1}/>}
            </div>
        </div>
        <div className="row">
            <div className="col-5">
                Name
            </div>
            <div className="col">
                {customerData.first_name || <Skeleton count={1}/>} {customerData.last_name || <Skeleton count={1}/>}
            </div>
        </div>
        <div className="row">
            <div className="col-5">
                User Name
            </div>
            <div className="col">
                {customerData.username}
            </div>
        </div>
        <div className="row">
            <div className="col-5">
                Phone Number
            </div>
            <div className="col">
                {customerData.phone}
            </div>
        </div>
        <div className="row">
            <div className="col-5">
                Deliver To
            </div>
            <div className="col">
                {customerData.address_line_1}
            </div>
        </div>
        <div className="row">
            <div className="col-5"></div>
            <div className="col">
                {customerData.address_line_2}
            </div>
        </div>
        <div className="row">
            <div className="col-5"></div>
            <div className="col">
                {customerData.city}, {customerData.pincode}
            </div>
        </div>
        <div className="row">
            <div className="col-5"></div>
            <div className="col">
                {customerData.country}
            </div>
        </div>
    </>)
}
const mapStateToProps = (state) => ({
    user: state.user, cart: state.cart.cart
})

export default connect(mapStateToProps)(UserDetails);