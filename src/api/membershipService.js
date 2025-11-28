import api from './api.js';

/**
 * Gets the user's active membership.
 * @returns {Promise<object|null>} The membership object or null.
 */
export const getMembershipStatus = async () => {
    try {
        const response = await api.get('/membership');
        return response.data; // Will be null if no active plan
    } catch (error) {
        console.error("Failed to fetch membership:", error);
        return null;
    }
};

/**
 * Subscribes to a new plan.
 * @param {string} plan - 'Silver', 'Gold', or 'Platinum'
 */
export const subscribeToPlan = async (plan) => {
    try {
        const response = await api.post('/membership', { plan });
        return response.data;
    } catch (error) {
        console.error("Failed to subscribe:", error);
        throw error;
    }
};