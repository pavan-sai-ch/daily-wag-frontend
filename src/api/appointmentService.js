import api from './api.js';

/**
 * (Customer) Books a new grooming appointment.
 * @param {object} appointmentData - { petId, serviceType, dateTime, comments }
 */
export const bookGrooming = async (appointmentData) => {
    try {
        // Helper: Ensure keys match what PHP expects (snake_case vs camelCase)
        const payload = {
            pet_id: appointmentData.petId,
            booking_date: appointmentData.dateTime,
            service_type: appointmentData.serviceType,
            // comments: appointmentData.comments // Uncomment if you add a comments column to your DB
        };

        const response = await api.post('/bookings/grooming', payload);
        return response.data;
    } catch (error) {
        console.error("Failed to book grooming:", error);
        throw error;
    }
};

/**
 * (Customer) Books a new doctor appointment.
 * @param {object} appointmentData - { petId, doctorId, serviceType, dateTime, comments }
 */
export const bookDoctorAppointment = async (appointmentData) => {
    try {
        // Helper: Ensure keys match what PHP expects
        const payload = {
            pet_id: appointmentData.petId,
            doctor_id: appointmentData.doctorId, // Critical: Map doctorId to doctor_id
            booking_date: appointmentData.dateTime,
            service_type: appointmentData.serviceType,
        };

        const response = await api.post('/bookings/medical', payload);
        return response.data;
    } catch (error) {
        console.error("Failed to book appointment:", error);
        throw error;
    }
};

/**
 * (Customer) Fetches all bookings for the logged-in user.
 */
export const getUserBookings = async () => {
    try {
        const response = await api.get('/bookings/user');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user bookings:", error);
        return [];
    }
};

/**
 * (Doctor) Fetches schedule for the logged-in doctor.
 * Note: The backend gets the doctor ID from the session, so no arg needed.
 */
export const getAppointmentsByDoctorId = async () => {
    try {
        const response = await api.get('/bookings/doctor');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch doctor schedule:", error);
        return [];
    }
};

/**
 * (Admin) Fetches ALL bookings in the system.
 */
export const getAllAppointments = async () => {
    try {
        const response = await api.get('/bookings/all');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all bookings:", error);
        return [];
    }
};

/**
 * (Admin) Updates the status of a booking (e.g., 'Confirmed', 'Cancelled').
 * @param {number} bookingId
 * @param {string} status
 */
export const updateAppointmentStatus = async (bookingId, status) => {
    try {
        const response = await api.put(`/bookings/${bookingId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Failed to update booking status:", error);
        throw error;
    }
};