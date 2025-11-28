import api from './api.js';

// --- User Pet Management ---

/**
 * Fetches all pets for the currently logged-in user.
 * Note: The userId arg is ignored because the session cookie determines the user.
 */
export const getPetsByUserId = async (userId) => {
    try {
        const response = await api.get('/pets');
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
            photo_url: response.data.photo_url || null,
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
        let payload;
        let headers = {};

        if (petData.imageFile) {
            payload = new FormData();
            Object.keys(petData).forEach(key => {
                if (key !== 'imageFile' && key !== 'tempPreview') {
                    payload.append(key, petData[key]);
                }
            });
            payload.append('image', petData.imageFile);
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            payload = petData;
        }

        // Using POST to update (for file support)
        const response = await api.post(`/pets/${petData.pet_id}`, payload, { headers });

        return {
            ...petData,
            photo_url: response.data.photo_url || petData.photo_url
        };
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
        const response = await api.get('/admin/pets');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all pets:", error);
        return [];
    }
};

// --- Immunization Functions (UPDATED) ---

/**
 * Fetches immunization records for a pet.
 * @param {number} petId
 */
export const getImmunizationRecords = async (petId) => {
    try {
        // Call the REAL API endpoint
        const response = await api.get(`/pets/${petId}/immunizations`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch immunization records:", error);
        return [];
    }
};

/**
 * Adds a new immunization record.
 * @param {object} recordData { pet_id, vaccine_name, vaccine_date, due_date, comments }
 */
export const addImmunizationRecord = async (recordData) => {
    try {
        const response = await api.post('/immunizations', recordData);
        return response.data;
    } catch (error) {
        console.error("Failed to add immunization:", error);
        throw error;
    }
};