const PETS_DB_KEY = 'mockPets';

/**
 * Initializes the "pets database" in localStorage if it doesn't exist.
 * This is exported and called by main.jsx to ensure the DB is ready on app load.
 */
export const initializePetDatabase = () => {
    if (!localStorage.getItem(PETS_DB_KEY)) {
        // Start with an empty array of pets
        localStorage.setItem(PETS_DB_KEY, JSON.stringify([]));
    }
};

/**
 * Internal helper: Gets all pets from localStorage.
 * @returns {Array} An array of all pet objects.
 */
const getAllPets = () => {
    try {
        const pets = localStorage.getItem(PETS_DB_KEY);
        return pets ? JSON.parse(pets) : [];
    } catch (error) {
        console.error("Error parsing pets from localStorage", error);
        return [];
    }
};

/**
 * Internal helper: Saves the entire pet array back to localStorage.
 * @param {Array} pets - The new array of pets.
 */
const savePets = (pets) => {
    localStorage.setItem(PETS_DB_KEY, JSON.stringify(pets));
};

/**
 * Internal helper: Simulates a network request delay.
 * @param {number} delay - The delay in milliseconds.
 */
const simulateNetworkRequest = (delay = 300) => {
    return new Promise(resolve => setTimeout(resolve, delay));
};

// --- Exportable API Functions ---

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
 * @param {object} updatedPetData - The full pet object with updated information.
 * @returns {Promise<object>} A promise that resolves with the updated pet object.
 */
export const updatePet = async (updatedPetData) => {
    await simulateNetworkRequest();
    let allPets = getAllPets();

    // Find the index of the pet to update and replace it
    const petIndex = allPets.findIndex(pet => pet.id === updatedPetData.id);
    if (petIndex === -1) {
        throw new Error("Pet not found");
    }

    allPets[petIndex] = updatedPetData; // Replace the old pet object with the new one
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

    const filteredPets = allPets.filter(pet => pet.id !== petId);
    savePets(filteredPets);

    return Promise.resolve();
};