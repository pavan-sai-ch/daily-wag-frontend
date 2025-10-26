// --- Constants for localStorage Keys ---
const PETS_DB_KEY = 'mockPets';
const IMMUNIZATIONS_DB_KEY = 'mockImmunizations';

// --- Mock Data (Used for Seeding) ---
// We seed an empty object for immunizations.
const seedImmunizationData = {};

// --- Internal Database Helper Functions ---

/**
 * (Internal) Gets all pets from localStorage.
 * @returns {Array} An array of all pet objects.
 */
const _getAllPets = () => {
    try {
        return JSON.parse(localStorage.getItem(PETS_DB_KEY)) || [];
    } catch (error) {
        console.error("Error parsing pets from localStorage", error);
        return [];
    }
};

/**
 * (Internal) Saves the entire pet array back to localStorage.
 * @param {Array} pets - The new array of pets.
 */
const _savePets = (pets) => {
    localStorage.setItem(PETS_DB_KEY, JSON.stringify(pets));
};

/**
 * (Internal) Gets all immunization records from localStorage.
 * @returns {object} An object with pet IDs as keys.
 */
const _getAllImmunizations = () => {
    try {
        return JSON.parse(localStorage.getItem(IMMUNIZATIONS_DB_KEY)) || {};
    } catch (error) {
        console.error("Error parsing immunizations from localStorage", error);
        return {};
    }
};

/**
 * (Internal) Saves all immunization records back to localStorage.
 * @param {object} records - The records object.
 */
const _saveImmunizations = (records) => {
    localStorage.setItem(IMMUNIZATIONS_DB_KEY, JSON.stringify(records));
};

/**
 * (Internal) Function to simulate a network request delay.
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
    if (localStorage.getItem(PETS_DB_KEY) === null) {
        _savePets([]); // Start with an empty array
    }
};

/**
 * Initializes the "immunizations database" in localStorage.
 */
export const initializeImmunizationDatabase = () => {
    if (localStorage.getItem(IMMUNIZATIONS_DB_KEY) === null) {
        _saveImmunizations(seedImmunizationData); // Start with an empty object
    }
};

// --- Exportable API Functions ---

/**
 * (Admin) Fetches ALL pets from the database.
 * @returns {Promise<Array>} A promise that resolves with an array of all pets.
 */
export const getAllPets = async () => {
    await simulateNetworkRequest();
    return _getAllPets();
};

/**
 * (Customer) Fetches all pets belonging to a specific user.
 * @param {string} userId - The ID of the logged-in user.
 * @returns {Promise<Array>} A promise that resolves with an array of the user's pets.
 */
export const getPetsByUserId = async (userId) => {
    await simulateNetworkRequest();
    const allPets = _getAllPets();
    const userPets = allPets.filter(pet => pet.userId === userId);
    return userPets;
};

/**
 * (Customer) Adds a new pet to the database for a specific user.
 * @param {object} petData - The new pet's data (e.g., { name, breed, age }).
 * @param {string} userId - The ID of the owner.
 * @returns {Promise<object>} A promise that resolves with the newly created pet object.
 */
export const addPet = async (petData, userId) => {
    await simulateNetworkRequest();
    const allPets = _getAllPets();

    const newPet = {
        ...petData,
        id: `pet${Date.now()}`, // Create a unique pet ID
        userId: userId,        // Link the pet to the user
    };

    allPets.push(newPet);
    _savePets(allPets);

    return newPet;
};

/**
 * (Customer) Updates an existing pet in the database.
 * @param {object} updatedPetData - The complete pet object with updated info.
 * @returns {Promise<object>} A promise that resolves with the updated pet object.
 */
export const updatePet = async (updatedPetData) => {
    await simulateNetworkRequest();
    let allPets = _getAllPets();

    const petIndex = allPets.findIndex(p => p.id === updatedPetData.id);

    if (petIndex === -1) {
        throw new Error("Pet not found for update.");
    }

    allPets[petIndex] = updatedPetData;
    _savePets(allPets);

    return updatedPetData;
};

/**
 * (Customer) Removes a pet from the database.
 * @param {string} petId - The ID of the pet to remove.
 * @returns {Promise<void>}
 */
export const removePet = async (petId) => {
    await simulateNetworkRequest();

    // Remove the pet
    let allPets = _getAllPets();
    const updatedPets = allPets.filter(p => p.id !== petId);
    _savePets(updatedPets);

    // Also remove associated immunization records
    let allImmunizations = _getAllImmunizations();
    if (allImmunizations[petId]) {
        delete allImmunizations[petId];
        _saveImmunizations(allImmunizations);
    }

    return;
};

/**
 * (Customer) Fetches immunization records for a specific pet.
 * @param {string} petId - The ID of the pet.
 */
export const getImmunizationRecords = async (petId) => {
    await simulateNetworkRequest();
    const allRecords = _getAllImmunizations();

    const petRecords = allRecords[petId];

    // Check if specific records exist
    if (petRecords && petRecords.length > 0) {
        return petRecords;
    }

    // Return default mock data if no specific records are found
    // This simulates a new pet's default vaccination schedule.
    return [
        { id: 'imm1', name: 'Rabies', date: 'Not Set', status: 'Pending' },
        { id: 'imm2', name: 'Bordetella', date: 'Not Set', status: 'Pending' },
        { id: 'imm3', name: 'Canine Distemper', date: 'Not Set', status: 'Pending' }
    ];
};
