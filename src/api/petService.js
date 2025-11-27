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
 * Adds a new pet to the database (handles File Uploads).
 * @param {object} petData - { pet_name, ..., imageFile (optional) }
 */
export const addPet = async (petData, userId) => {
    try {
        let payload;
        let headers = {};

        // Check if we have a file to upload
        if (petData.imageFile) {
            payload = new FormData();
            // Append all text fields
            Object.keys(petData).forEach(key => {
                if (key !== 'imageFile' && key !== 'tempPreview') {
                    payload.append(key, petData[key]);
                }
            });
            // Append the file (must match key 'image' in PHP)
            payload.append('image', petData.imageFile);

            // Let the browser set the Content-Type to multipart/form-data automatically
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            // Standard JSON payload
            payload = petData;
        }

        const response = await api.post('/pets', payload, { headers });

        // Return the new pet object (backend returns photo_url)
        return {
            ...petData,
            pet_id: response.data.pet_id,
            photo_url: response.data.photo_url || null, // Use the real URL from S3
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
        // Note: For simplicity, this update currently handles text fields (JSON).
        // Updating images via PUT usually requires a workaround or POST override.
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