import api from './api.js';

export const logPageVisit = async (pageName) => {
    try {
        // Fire and forget - we don't wait for response
        api.post('/log-visit', { page: pageName });
    } catch (error) {
        // Ignore logging errors
    }
};