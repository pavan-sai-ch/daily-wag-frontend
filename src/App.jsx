import React, { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import AppRouter from './routes/AppRouter.jsx';
import { loginSuccess, logout } from './store/authSlice.js';
import { checkAuth } from './api/authService.js';
import { logPageVisit } from './api/visitService.js';
import './assets/styles/global.css';

// Create a wrapper component to handle routing logic (useLocation)
const AppContent = () => {
    const location = useLocation();

    // Track page views for analytics
    useEffect(() => {
        if (location.pathname) {
            logPageVisit(location.pathname);
        }
    }, [location]);

    return (
        <div className="app-container">
            <Navbar />
            <main>
                <AppRouter />
            </main>
            <Footer />
        </div>
    );
};

function App() {
    const dispatch = useDispatch();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    // Check for existing session on app load
    useEffect(() => {
        const authenticateUser = async () => {
            try {
                // Ask the backend if we have a valid session
                const user = await checkAuth();

                if (user) {
                    // If yes, restore the Redux state
                    dispatch(loginSuccess(user));
                } else {
                    // If no, ensure Redux is clear
                    dispatch(logout());
                }
            } catch (error) {
                console.error("App initialization error:", error);
                dispatch(logout());
            } finally {
                // Done checking, allow the app to render
                setIsAuthChecked(true);
            }
        };

        authenticateUser();
    }, [dispatch]);

    // Don't render the router until we know the auth status
    if (!isAuthChecked) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;