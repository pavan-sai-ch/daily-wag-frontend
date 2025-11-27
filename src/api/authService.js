import api from './api.js';

/**
 * Logs the user in via the PHP backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} The user object from the backend.
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
 * @param {object} userData (firstName, lastName, email, password)
 * @returns {Promise<object>} The response data.
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

/**
 * Fetches all users (Admin only).
 * @returns {Promise<Array>} List of users.
 */
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
};

/**
 * Updates the logged-in user's profile information.
 * @param {object} profileData - { first_name, last_name, phone, address }
 * @returns {Promise<object>} The updated user object.
 */
export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/auth/profile', profileData);
        if (response.data.status === 'success') {
            return response.data.user;
        } else {
            throw new Error(response.data.message || 'Update failed');
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
    }
};