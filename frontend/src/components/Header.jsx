import React from "react";
import {Link, Outlet} from "react-router-dom";
import {connect} from "react-redux";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import {logout} from "../redux/actions/actions";

function Header({user, cart, logout}) {
    return (<>
        <nav className="navbar navbar-expand-lg bg-secondary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Order Management</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link " to='/'><HomeRoundedIcon/></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link "
                                  to='/products'><FormatListBulletedRoundedIcon/></Link>
                        </li>
                        <li className="nav-item">
                            {cart.length === 0
                                ? <Link className="nav-link " to='/cart'><ShoppingCartRoundedIcon/></Link>
                                : <Link className="nav-link " to='/cart'>
                                    <span><ShoppingCartRoundedIcon/></span>
                                    <span className="badge bg-success rounded-pill ms-1">{cart.length}</span>
                                </Link>
                            }
                        </li>

                        {user.isAuthenticated
                            ? <>
                                <li className="nav-item">
                                    <Link className="nav-link  " to='/profile'><PersonRoundedIcon/></Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link  " to='/'
                                          onClick={() => logout()}><LogoutRoundedIcon/></Link>
                                </li>
                            </>
                            : <li className="nav-item">
                                <Link className="nav-link  " to='/login'><LoginRoundedIcon/></Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
        <Outlet/>

    </>);
}

const mapStateToProps = (state) => ({
    cart: state.cart.cart, user: state.user
})

const mapDispatchToProps = {
    logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);