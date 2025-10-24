const APPOINTMENTS_DB_KEY = 'mockAppointments';

/**
 * Initializes the "appointments database" in localStorage if it doesn't exist.
 */
export const initializeAppointmentDatabase = () => {
    if (!localStorage.getItem(APPOINTMENTS_DB_KEY)) {
        localStorage.setItem(APPOINTMENTS_DB_KEY, JSON.stringify([]));
    }
};

/**
 * Gets all appointments from localStorage.
 */
const getAppointments = () => {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_DB_KEY));
};

/**
 * Saves the entire appointment array back to localStorage.
 */
const saveAppointments = (appointments) => {
    localStorage.setItem(APPOINTMENTS_DB_KEY, JSON.stringify(appointments));
};

/**
 * Simulates booking a new appointment.
 * @param {object} apptData - The appointment data.
 * @returns {Promise<object>} The newly created appointment.
 */
export const bookAppointment = async (apptData) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const allAppointments = getAppointments();
    const newAppointment = {
        ...apptData,
        id: `appt${Date.now()}`,
        status: 'Scheduled',
    };

    allAppointments.push(newAppointment);
    saveAppointments(allAppointments);

    return newAppointment;
};
