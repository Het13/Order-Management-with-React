import React from "react";
import {Link, Outlet} from "react-router-dom";
import {connect} from "react-redux";

function Header({user}) {
    return (<>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Order Management</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link " to='/'>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/products'>Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/cart'>My Cart</Link>
                        </li>
                        <li className="nav-item">
                            {user.isAuthenticated ?
                                <Link className="nav-link disabled" to='/register'>Login/Sign Up</Link> :
                                <Link className="nav-link " to='/register'>Logged In</Link>}

                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <Outlet/>
    </>);
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(Header);