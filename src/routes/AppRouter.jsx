import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Page Imports ---
// Public Pages
// Using absolute paths from /src/ to fix resolution issues
import HomePage from '/src/pages/HomePage.jsx';
import LoginPage from '/src/pages/LoginPage.jsx';
import AdoptionPage from '/src/pages/AdoptionPage.jsx';
import StorePage from '/src/pages/StorePage.jsx';

// Protected Pages
import ProfilePage from '/src/pages/ProfilePage.jsx';
import AppointmentsPage from '/src/pages/AppointmentsPage.jsx';
import DoctorDashboardPage from '/src/pages/DoctorDashboardPage.jsx';

// --- Route Protector Imports ---
import RoleBasedRoute from '/src/routes/RoleBasedRoute.jsx';
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";

/**
 * AppRouter
 * This component defines all the application's routes and maps them
 * to their corresponding page components. It uses RoleBasedRoute
 * to protect pages that require a specific user role.
 */
const AppRouter = () => {
    return (
        <Routes>
            {/* --- Public Routes (Visible to Everyone) --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/store" element={<StorePage />} />

            {/* --- Customer-Only Routes --- */}
            <Route
                path="/profile"
                element={
                    <RoleBasedRoute allowedRoles={['customer']}>
                        <ProfilePage />
                    </RoleBasedRoute>
                }
            />
            <Route
                path="/appointments"
                element={
                    <RoleBasedRoute allowedRoles={['customer']}>
                        <AppointmentsPage />
                    </RoleBasedRoute>
                }
            />

            {/* --- Doctor-Only Route --- */}
            <Route
                path="/doctor/dashboard"
                element={
                    <RoleBasedRoute allowedRoles={['doctor']}>
                        <DoctorDashboardPage />
                    </RoleBasedRoute>
                }
            />
            <Route
                path="/admin/dashboard"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminDashboardPage />
                    </RoleBasedRoute>
                }
            />

            {/* A "catch-all" 404 page could be added here later, e.g.:
        <Route path="*" element={<NotFoundPage />} />
      */}
        </Routes>
    );
};

export default AppRouter;

