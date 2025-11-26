import api from './api';

/**
 * Logs the user in via the PHP backend.
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.status === 'success') {
            return response.data.user;
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
    }
};

/**
 * Registers a new user via the PHP backend.
 */
export const signup = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.data.status === 'success') {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Signup failed');
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
    }
};
/**
 * Checks if the user is already logged in via a session cookie.
 * @returns {Promise<object|null>} The user object if logged in, or null.
 */
export const checkAuth = async () => {
    try {
        const response = await api.get('/auth/me');
        if (response.data.authenticated) {
            return response.data.user;
        }
        return null;
    } catch (error) {
        // If the check fails (e.g., network error), assume not logged in
        console.error("Auth check failed:", error);
        return null;
    }
};
// --- NEW ADDITION ---
// Fetches all users (Admin only)
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
};