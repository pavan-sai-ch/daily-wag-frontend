// This file acts as a simple, in-memory mock service for doctor data.
// This data is separate from the main user authentication, as it's
// data that would typically be managed by an admin.

// Function to simulate a network request delay
const simulateNetworkRequest = (delay = 300) => {
    return new Promise(resolve => setTimeout(resolve, delay));
};

// In-memory list of doctors. We get their IDs from the
// `mockUsers` list in `mockData.js` to keep them consistent.
const mockDoctorList = [
    {
        id: 'doc001', // Must match the ID in mockData.js
        firstName: 'Emily',
        lastName: 'Carter',
        specialization: 'General Veterinary Medicine',
        clinicHours: 'Mon-Fri: 9:00 AM - 5:00 PM\nSat: 10:00 AM - 2:00 PM'
    },
    {
        id: 'doc002', // You would add this user to mockData.js as well
        firstName: 'David',
        lastName: 'Lee',
        specialization: 'Veterinary Surgery',
        clinicHours: 'Tue-Thu: 8:00 AM - 6:00 PM'
    }
];

/**
 * Fetches the list of all available doctors.
 * @returns {Array} A list of doctor objects.
 */
export const getDoctors = () => {
    // In a real app, this would be an async API call.
    // For the mock, we can just return the list directly.
    return mockDoctorList;
};

/**
 * Updates the clinic hours for a specific doctor.
 * @param {string} doctorId - The ID of the doctor.
 * @param {string} newHours - The new clinic hours string.
 * @returns {Promise<object>} The updated doctor object.
 */
export const updateDoctorHours = async (doctorId, newHours) => {
    await simulateNetworkRequest();

    const doctor = mockDoctorList.find(doc => doc.id === doctorId);

    if (doctor) {
        doctor.clinicHours = newHours;
        console.log("Updated doctor hours in mock service:", doctor);
        return Promise.resolve(doctor);
    } else {
        return Promise.reject(new Error("Doctor not found"));
    }
};

