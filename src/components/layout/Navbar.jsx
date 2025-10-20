import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
                    <Link to="/login" className="nav-link-button">Login/Signup</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;