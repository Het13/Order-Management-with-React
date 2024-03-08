import UserDetails from "../components/UserDetails";
import {Link} from "react-router-dom";

function Profile() {
    return (<>
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-7 col-lg-6 fs-5">
                    <div className="m-3"><UserDetails/>
                    </div>
                </div>
            </div>
            <Link to='/orders' className="btn btn-outline-info w-50 py-2 mt-2">My Orders</Link>
        </div>
    </>)
}


export default Profile;