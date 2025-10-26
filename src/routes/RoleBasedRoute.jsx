import ProtectedRoute from "./ProtectedRoute.jsx";
import {useSelector} from "react-redux";
import {Navigate, useLocation} from "react-router-dom";
import React from "react";

const RoleBasedRoute = ({allowedRoles, children}) => {
    // Get the current user from the Redux store
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    // 1. First, we wrap everything in the original ProtectedRoute.
    //    This handles the primary "is the user logged in?" check.
    //    If not, ProtectedRoute will handle the redirect to /login.
    return (
        <ProtectedRoute>
            {/* 2. If the user IS logged in, we proceed to check their role */}
            {allowedRoles.includes(user?.role) ? (
                // 3. If their role is in the allowedRoles array, show the page
                children
            ) : (
                // 4. If they are logged in but have the WRONG role
                //    (e.g., a 'customer' trying to access '/doctor/dashboard'),
                //    send them to the homepage (or an "Unauthorized" page).
                <Navigate to="/" state={{ from: location }} replace />
            )}
        </ProtectedRoute>
    );
}
export default RoleBasedRoute;