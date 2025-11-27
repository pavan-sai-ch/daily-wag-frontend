import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // Helper to render links based on role
    const renderLinks = () => {
        // 1. Guest (Not Logged In)
        if (!isAuthenticated) {
            return (
                <>
                    <li className="nav-item"><Link to="/adoption" className="nav-link">Adoption</Link></li>
                    <li className="nav-item"><Link to="/appointments" className="nav-link">Appointments</Link></li>
                    <li className="nav-item"><Link to="/store" className="nav-link">Store</Link></li>
                    <li className="nav-item"><Link to="/login" className="nav-link-button">Login</Link></li>
                </>
            );
        }

        // 2. Doctor
        if (user?.role === 'doctor') {
            return (
                <>
                    <li className="nav-item">
                        <span className="nav-text">Dr. {user.lastName}</span>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleLogout} className="nav-link-button logout-button">Logout</button>
                    </li>
                </>
            );
        }

        // 3. Admin
        if (user?.role === 'admin') {
            return (
                <>
                    <li className="nav-item">
                        <span className="nav-text">Admin Dashboard</span>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleLogout} className="nav-link-button logout-button">Logout</button>
                    </li>
                </>
            );
        }

        // 4. Regular User (Customer)
        return (
            <>
                <li className="nav-item"><Link to="/adoption" className="nav-link">Adoption</Link></li>
                <li className="nav-item"><Link to="/appointments" className="nav-link">Appointments</Link></li>
                <li className="nav-item"><Link to="/store" className="nav-link">Store</Link></li>
                <li className="nav-item">
                    <Link to="/profile" className="nav-link">Hi, {user.firstName}</Link>
                </li>
                <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link-button logout-button">Logout</button>
                </li>
            </>
        );
    };

    // Determine the logo link destination based on role
    const getBrandLink = () => {
        if (!isAuthenticated) return "/";
        if (user?.role === 'doctor') return "/doctor/dashboard";
        if (user?.role === 'admin') return "/admin/dashboard";
        return "/";
    };

    return (
        <nav className="navbar">
            <Link to={getBrandLink()} className="navbar-brand">The Daily Wag</Link>
            <ul className="navbar-nav">
                {renderLinks()}
            </ul>
        </nav>
    );
};

export default Navbar;