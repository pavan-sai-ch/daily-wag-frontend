import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../store/authSlice.js";

const Navbar = () => {
    const {isAuthenticated, user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">The Daily Wag</Link>
            <div className="navbar-nav">
                <div className="nav-item">
                    <Link to="/adoption" className="nav-link">Adoption</Link>
                </div>
                <div className="nav-item">
                    <Link to="/appointments" className="nav-link">Appointments</Link>
                </div>
                <div className="nav-item">
                    <Link to="/store" className="nav-link">Store</Link>
                </div>
                <div className="nav-item">
                    {isAuthenticated ? (<>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">
                                    Welcome, {user.firstName}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-link-button logout-button">
                                    Logout
                                </button>
                            </li>
                        </>):
                    <Link to="/login" className="nav-link-button">Login/Signup</Link>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;