import api from './api.js';

// --- Public / User Functions ---

/**
 * Fetches all pets that are currently available for adoption.
 * @returns {Promise<Array>} List of pets
 */
export const getAvailablePets = async () => {
    try {
        const response = await api.get('/adoption/available');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch available pets:", error);
        return [];
    }
};

/**
 * Submits a request to adopt a specific pet.
 * @param {number} petId - The ID of the pet to adopt
 */
export const requestAdoption = async (petId) => {
    try {
        const response = await api.post('/adoption/request', { pet_id: petId });
        return response.data;
    } catch (error) {
        console.error("Failed to request adoption:", error);
        throw error;
    }
};

// --- Admin Functions ---

/**
 * (Admin) Fetches all pending adoption requests.
 * @returns {Promise<Array>} List of pending requests
 */
export const getPendingRequests = async () => {
    try {
        const response = await api.get('/adoption/pending');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch pending requests:", error);
        return [];
    }
};

/**
 * (Admin) Updates the status of an adoption request.
 * @param {number} adoptId - The ID of the adoption request
 * @param {string} status - 'approved' or 'denied'
 */
export const updateAdoptionStatus = async (adoptId, status) => {
    try {
        const response = await api.put(`/adoption/${adoptId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Failed to update adoption status:", error);
        throw error;
    }
};

/**
 * (Admin) Adds a new pet directly to the adoption list (handles File Uploads).
 * @param {object} petData - { pet_name, ..., imageFile (optional) }
 */
export const addAdoptionPet = async (petData) => {
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

        const response = await api.post('/admin/pets', payload, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to add adoption pet:", error);
        throw error;
    }
};