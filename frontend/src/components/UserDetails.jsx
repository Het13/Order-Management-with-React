import axios from "axios";
import {useEffect, useState} from "react";

const UserDetails = (props) => {

    const [customerData, setCustomerData] = useState(null)

    const customer_id = props.user.customerId

    useEffect(() => {
        getCustomerData();
    }, []);

    async function getCustomerData() {
        try {
            const response = await axios(`/api/v1/customers/${customer_id}`, {}, {
                headers: {
                    "Authorization": props.user.jwtToken,
                    'Content-Type': 'application/json'
                }
            })
            console.log(response.data.customer)
            setCustomerData(response.data.customer)
        } catch (e) {
            console.log(e)
        }
    }

    if (customerData === null) {
        return <div>
            Loading...
        </div>
    }
    return (
        <div className="col-md-7 col-lg-6 fs-5">
            <h3 className="mb-3">User Details</h3>
            <div className="row">
                <div className="col-4">
                    Email
                </div>
                <div className="col">
                    {customerData.email}
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    Name
                </div>
                <div className="col">
                    {customerData.first_name} {customerData.last_name}
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    User Name
                </div>
                <div className="col">
                    {customerData.username}
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    Phone Number
                </div>
                <div className="col">
                    {customerData.phone}
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    Deliver To
                </div>
                <div className="col">
                    {customerData.address_line_1}
                </div>
            </div>
            <div className="row">
                <div className="col-4"></div>
                <div className="col">
                    {customerData.address_line_2}
                </div>
            </div>
            <div className="row">
                <div className="col-4"></div>
                <div className="col">
                    {customerData.city}, {customerData.pincode}
                </div>
            </div>
            <div className="row">
                <div className="col-4"></div>
                <div className="col">
                    {customerData.country}
                </div>
            </div>
        </div>
    )
}


export default UserDetails;