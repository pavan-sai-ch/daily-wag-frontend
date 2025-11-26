import api from './api.js';

/**
 * Fetches the list of all available doctors from the backend.
 * @returns {Promise<Array>}
 */
export const getDoctors = async () => {
    try {
        const response = await api.get('/doctors');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
};

// Mock function for updating hours (since we haven't built that backend part yet)
export const updateDoctorHours = async (doctorId, newHours) => {
    console.log(`Mock update hours for ${doctorId}: ${newHours}`);
    return Promise.resolve();
};