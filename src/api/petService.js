import api from './api.js';

// --- User Pet Management ---

/**
 * Fetches all pets for the currently logged-in user.
 * Note: The userId arg is ignored because the session cookie determines the user.
 */
export const getPetsByUserId = async (userId) => {
    try {
        const response = await api.get('/pets');
        // PHP returns the array of pets directly or inside a data property
        // Adjust depending on your BaseController response format
        return response.data;
    } catch (error) {
        console.error("Failed to fetch pets:", error);
        throw error;
    }
};

/**
 * Adds a new pet to the database.
 * @param {object} petData - { pet_name, pet_category, pet_breed, pet_age, medical_condition }
 */
export const addPet = async (petData, userId) => {
    try {
        // Ensure parameter names match your PHP Controller/Model expectations
        const response = await api.post('/pets', petData);

        // We return the new pet object to update the UI immediately
        // The PHP response usually contains the new ID
        return {
            ...petData,
            pet_id: response.data.pet_id, // Ensure PHP returns this
            user_id: userId
        };
    } catch (error) {
        console.error("Failed to add pet:", error);
        throw error;
    }
};

/**
 * Updates an existing pet.
 * @param {object} petData - Must include pet_id
 */
export const updatePet = async (petData) => {
    try {
        await api.put(`/pets/${petData.pet_id}`, petData);
        return petData; // Return updated data to update UI state
    } catch (error) {
        console.error("Failed to update pet:", error);
        throw error;
    }
};

/**
 * Removes a pet.
 * @param {string|number} petId
 */
export const removePet = async (petId) => {
    try {
        await api.delete(`/pets/${petId}`);
        return true;
    } catch (error) {
        console.error("Failed to delete pet:", error);
        throw error;
    }
};

// --- Admin Functions ---

/**
 * Fetches ALL pets (Admin only).
 */
export const getAllPets = async () => {
    try {
        // Connect to the real backend endpoint
        const response = await api.get('/admin/pets');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all pets:", error);
        return [];
    }
};

// --- Immunization Functions ---

/**
 * Fetches immunization records for a pet.
 * NOTE: We haven't built the PHP Immunization Controller yet,
 * so we will keep this as a MOCK for now to prevent errors.
 */
export const getImmunizationRecords = async (petId) => {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return default mock data
    return [
        { id: 'imm1', name: 'Rabies', date: '2024-01-15', status: 'Up to Date' },
        { id: 'imm2', name: 'Bordetella', date: '2024-01-15', status: 'Up to Date' },
        { id: 'imm3', name: 'Canine Distemper', date: 'Not Set', status: 'Pending' }
    ];
};