import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Page Imports ---
// Changed from absolute '/src/...' to relative '../...' paths
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import AdoptionPage from '../pages/AdoptionPage.jsx';
import StorePage from '../pages/StorePage.jsx';

// Protected Pages
import ProfilePage from '../pages/ProfilePage.jsx';
import AppointmentsPage from '../pages/AppointmentsPage.jsx';
import DoctorDashboardPage from '../pages/DoctorDashboardPage.jsx';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import MembershipPage from '../pages/MembershipPage.jsx';
// --- Route Protector Imports ---
// Changed from '/src/routes/...' to relative './...' path
import RoleBasedRoute from './RoleBasedRoute.jsx';

const AppRouter = () => {
    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            {/* --- Customer/User Routes --- */}
            <Route
                path="/profile"
                element={
                    <RoleBasedRoute allowedRoles={['user']}>
                        <ProfilePage />
                    </RoleBasedRoute>
                }
            />
            <Route
                path="/appointments"
                element={
                    <RoleBasedRoute allowedRoles={['user']}>
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

            {/* --- Admin-Only Route --- */}
            <Route
                path="/admin/dashboard"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminDashboardPage />
                    </RoleBasedRoute>
                }
            />
        </Routes>
    );
};

export default AppRouter;