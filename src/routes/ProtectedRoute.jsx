import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    // Get the authentication status from the Redux store
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        // If user is not logged in, redirect to the /login page
        return <Navigate to="/login" />;
    }

    // If user is logged in, render the child component (in this case, the ProfilePage)
    return children;
};

export default ProtectedRoute;