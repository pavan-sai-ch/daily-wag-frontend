// --- Constants for localStorage Keys ---
const PETS_DB_KEY = 'mockPets';
const IMMUNIZATIONS_DB_KEY = 'mockImmunizations';

// --- Mock Data (Used for Seeding) ---
// We seed an empty object for immunizations. 
// A real app might have default records for new pets.
const seedImmunizationData = {};

// --- Database Helper Functions (Internal) ---

/**
 * Gets all pets from localStorage.
 * @returns {Array} An array of all pet objects.
 */
const getAllPets = () => {
    try {
        return JSON.parse(localStorage.getItem(PETS_DB_KEY)) || [];
    } catch (error) {
        console.error("Error parsing pets from localStorage", error);
        return [];
    }
};

/**
 * Saves the entire pet array back to localStorage.
 * @param {Array} pets - The new array of pets.
 */
const savePets = (pets) => {
    localStorage.setItem(PETS_DB_KEY, JSON.stringify(pets));
};

/**
 * Gets all immunization records from localStorage.
 * @returns {object} An object with pet IDs as keys.
 */
const getAllImmunizations = () => {
    try {
        return JSON.parse(localStorage.getItem(IMMUNIZATIONS_DB_KEY)) || {};
    } catch (error) {
        console.error("Error parsing immunizations from localStorage", error);
        return {};
    }
};

/**
 * Function to simulate a network request delay.
 * @param {number} delay - The delay in milliseconds.
 */
const simulateNetworkRequest = (delay = 300) => {
    return new Promise(resolve => setTimeout(resolve, delay));
};

// --- Exportable Initializers (Called by main.jsx) ---

/**
 * Initializes the "pets database" in localStorage if it doesn't exist.
 */
export const initializePetDatabase = () => {
    if (!localStorage.getItem(PETS_DB_KEY)) {
        localStorage.setItem(PETS_DB_KEY, JSON.stringify([]));
    }
};

/**
 * Initializes the "immunizations database" in localStorage.
 */
export const initializeImmunizationDatabase = () => {
    if (!localStorage.getItem(IMMUNIZATIONS_DB_KEY)) {
        localStorage.setItem(IMMUNIZATIONS_DB_KEY, JSON.stringify(seedImmunizationData));
    }
};

// --- Exportable Pet API Functions (CRUD) ---

/**
 * Fetches all pets belonging to a specific user.
 * @param {string} userId - The ID of the logged-in user.
 * @returns {Promise<Array>} A promise that resolves with an array of the user's pets.
 */
export const getPetsByUserId = async (userId) => {
    await simulateNetworkRequest();
    const allPets = getAllPets();
    const userPets = allPets.filter(pet => pet.userId === userId);
    return userPets;
};

/**
 * Adds a new pet to the database for a specific user.
 * @param {object} petData - The new pet's data (e.g., { name, breed, age }).
 * @param {string} userId - The ID of the owner.
 * @returns {Promise<object>} A promise that resolves with the newly created pet object.
 */
export const addPet = async (petData, userId) => {
    await simulateNetworkRequest();
    const allPets = getAllPets();

    const newPet = {
        ...petData,
        id: `pet${Date.now()}`, // Create a unique pet ID
        userId: userId,        // Link the pet to the user
    };

    allPets.push(newPet);
    savePets(allPets);

    return newPet;
};

/**
 * Updates an existing pet in the database.
 * @param {object} updatedPetData - The complete pet object with updated info.
 * @returns {Promise<object>} A promise that resolves with the updated pet object.
 */
export const updatePet = async (updatedPetData) => {
    await simulateNetworkRequest();
    let allPets = getAllPets();

    // Find the index of the pet to update
    const petIndex = allPets.findIndex(p => p.id === updatedPetData.id);

    if (petIndex === -1) {
        throw new Error("Pet not found for update.");
    }

    // Replace the old pet object with the new one
    allPets[petIndex] = updatedPetData;
    savePets(allPets);

    return updatedPetData;
};

/**
 * Removes a pet from the database.
 * @param {string} petId - The ID of the pet to remove.
 * @returns {Promise<void>}
 */
export const removePet = async (petId) => {
    await simulateNetworkRequest();
    let allPets = getAllPets();

    // Create a new array without the removed pet
    const updatedPets = allPets.filter(p => p.id !== petId);

    savePets(updatedPets);

    // We should also remove associated immunization records
    let allImmunizations = getAllImmunizations();
    if (allImmunizations[petId]) {
        delete allImmunizations[petId];
        localStorage.setItem(IMMUNIZATIONS_DB_KEY, JSON.stringify(allImmunizations));
    }

    return;
};

// --- Exportable Immunization API Function ---

/**
 * Fetches immunization records for a specific pet.
 * @param {string} petId - The ID of the pet.
 */
export const getImmunizationRecords = async (petId) => {
    await simulateNetworkRequest();
    const allRecords = getAllImmunizations();

    const petRecords = allRecords[petId];

    if (petRecords && petRecords.length > 0) {
        return petRecords;
    }

    // Return default mock data if no specific records are found
    return [
        { id: 'imm1', name: 'Rabies', date: '2024-01-15', status: 'Up to Date' },
        { id: 'imm2', name: 'Bordetella', date: '2024-01-15', status: 'Up to Date' },
        { id: 'imm3', name: 'Canine Distemper', date: 'Not Set', status: 'Pending' }
    ];
};

