// --- Constants for localStorage Key ---
const APPOINTMENTS_DB_KEY = 'mockAppointments';

// --- Internal Database Helper Functions ---

/**
 * (Internal) Gets all appointments from localStorage.
 * @returns {Array} An array of all appointment objects.
 */
const _getAppointments = () => {
    try {
        return JSON.parse(localStorage.getItem(APPOINTMENTS_DB_KEY)) || [];
    } catch (error) {
        console.error("Error parsing appointments from localStorage", error);
        return [];
    }
};

/**
 * (Internal) Saves the entire appointments array back to localStorage.
 * @param {Array} appointments - The new array of appointments.
 */
const _saveAppointments = (appointments) => {
    localStorage.setItem(APPOINTMENTS_DB_KEY, JSON.stringify(appointments));
};

/**
 * (Internal) Function to simulate a network request delay.
 * @param {number} delay - The delay in milliseconds.
 */
const simulateNetworkRequest = (delay = 400) => {
    return new Promise(resolve => setTimeout(resolve, delay));
};

// --- Exportable Initializer (Called by main.jsx) ---

/**
 * Initializes the "appointments database" in localStorage if it doesn't exist.
 */
export const initializeAppointmentDatabase = () => {
    if (localStorage.getItem(APPOINTMENTS_DB_KEY) === null) {
        _saveAppointments([]); // Start with an empty array
    }
};

// --- Exportable API Functions ---

/**
 * (Customer) Books a new grooming appointment.
 * THIS IS THE FUNCTION YOUR GROOMING FORM SHOULD IMPORT
 */
export const bookGrooming = async (appointmentData) => {
    await simulateNetworkRequest();
    const allAppointments = _getAppointments();

    const newAppointment = {
        ...appointmentData,
        id: `app${Date.now()}`,
        status: 'Pending', // All new appointments are pending admin approval
        type: 'Grooming',
    };

    allAppointments.push(newAppointment);
    _saveAppointments(allAppointments);

    return newAppointment;
};

/**
 * (Customer) Books a new doctor appointment.
 * THIS IS THE FUNCTION YOUR DOCTOR FORM SHOULD IMPORT
 */
export const bookDoctorAppointment = async (appointmentData) => {
    await simulateNetworkRequest();
    const allAppointments = _getAppointments();

    const newAppointment = {
        ...appointmentData,
        id: `app${Date.now()}`,
        status: 'Pending', // All new appointments are pending admin approval
        type: 'Medical',
    };

    allAppointments.push(newAppointment);
    _saveAppointments(allAppointments);

    return newAppointment;
};

/**
 * (Doctor) Fetches all appointments for a specific doctor.
 * @param {string} doctorId - The ID of the doctor.
 * @returns {Promise<Array>} A promise that resolves with an array of appointments.
 */
export const getAppointmentsByDoctorId = async (doctorId) => {
    await simulateNetworkRequest();
    const allAppointments = _getAppointments();

    return allAppointments.filter(app => app.doctorId === doctorId);
};

/**
 * (Admin) Fetches ALL appointments from the database.
 * @returns {Promise<Array>} A promise that resolves with an array of all appointments.
 */
export const getAllAppointments = async () => {
    await simulateNetworkRequest();
    return _getAppointments();
};

/**
 * (Admin) Updates an appointment's status.
 * @param {string} appointmentId - The ID of the appointment to update.
 * @param {string} status - The new status (e.g., "Confirmed", "Cancelled").
 * @returns {Promise<object>} A promise that resolves with the updated appointment.
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
    await simulateNetworkRequest(150); // Make status updates fast
    let allAppointments = _getAppointments();

    const appIndex = allAppointments.findIndex(a => a.id === appointmentId);

    if (appIndex !== -1) {
        allAppointments[appIndex].status = status;
        _saveAppointments(allAppointments);
        return allAppointments[appIndex];
    } else {
        throw new Error("Appointment not found");
    }
};

