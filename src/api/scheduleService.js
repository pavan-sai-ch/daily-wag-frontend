import api from './api.js';

/**
 * (Doctor/Admin) Sets the schedule for a specific day.
 * @param {object} scheduleData - { day, start, end, active, doctor_id (optional) }
 */
export const setSchedule = async (scheduleData) => {
    try {
        const response = await api.post('/schedule', scheduleData);
        return response.data;
    } catch (error) {
        console.error("Failed to set schedule:", error);
        throw error;
    }
};

/**
 * (Doctor/Admin) Gets the full weekly schedule for a provider.
 * @param {number|null} doctorId - The doctor ID (or null for grooming schedule)
 */
export const getSchedule = async (doctorId = null) => {
    try {
        const params = doctorId ? { doctor_id: doctorId } : {};
        const response = await api.get('/schedule', { params });
        return response.data;
    } catch (error) {
        console.error("Failed to get schedule:", error);
        // Return default/empty schedule structure to prevent crashes
        return [];
    }
};

/**
 * (Customer) Gets available time slots for a specific date.
 * @param {string} date - YYYY-MM-DD
 * @param {number|null} doctorId - The doctor ID (or null for grooming)
 * @returns {Promise<Array>} List of slots: [{ time, display, available }, ...]
 */
export const getAvailableSlots = async (date, doctorId = null) => {
    try {
        const params = { date };
        if (doctorId) {
            params.doctor_id = doctorId;
        }
        const response = await api.get('/slots', { params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch slots:", error);
        return [];
    }
};