import React from 'react';
import { Routes, Route } from 'react-router-dom';

// routes import paths
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import AppointmentsPage from '../pages/AppointmentsPage.jsx';
import StorePage from '../pages/StorePage.jsx';
import AdoptionPage from '../pages/AdoptionPage.jsx';
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} /> //homepage route
            <Route path="/login" element={<LoginPage />} /> //login route
            <Route path="/appointments" element={<AppointmentsPage />} /> //appointments route
            <Route path="/store" element={<StorePage />} /> //store route
            <Route path="/adoption" element={<AdoptionPage />} /> //adoption route

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
};

export default AppRouter;