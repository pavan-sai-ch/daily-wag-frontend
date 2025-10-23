import { initialMockUsers } from './mockData';

const DB_KEY = 'mockUsers';

// --- Database Helper Functions ---

/**
 * Initializes the "database" in localStorage if it doesn't exist.
 * This is now exported to be called by main.jsx
 */
export const initializeUserDatabase = () => {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(initialMockUsers));
    }
};

/**
 * Gets all users from localStorage.
 * @returns {Array} An array of user objects.
 */
const getUsers = () => {
    return JSON.parse(localStorage.getItem(DB_KEY));
};

/**
 * Saves the entire user array back to localStorage.
 * @param {Array} users - The new array of users.
 */
const saveUsers = (users) => {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
};

// --- API Functions ---

// Function to simulate a network request delay
const simulateNetworkRequest = (delay = 500) => {
    return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates a login API call.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
export const login = async (email, password) => {
    await simulateNetworkRequest();

    const users = getUsers(); // Get current users from localStorage
    const user = users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (user && user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        return Promise.resolve(userWithoutPassword);
    } else {
        return Promise.reject(new Error('Invalid email or password.'));
    }
};

/**
 * Simulates a signup API call.
 * @param {object} userData - The new user's data.
 */
export const signup = async (userData) => {
    await simulateNetworkRequest();

    const users = getUsers(); // Get current users from localStorage
    const { email, firstName, lastName, password } = userData;

    const emailExists = users.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
        return Promise.reject(new Error('An account with this email already exists.'));
    }

    const newUser = {
        id: `user${Date.now()}`, // Use timestamp for a unique ID
        role: 'customer',
        firstName,
        lastName,
        email,
        password, // Storing plain text for mock setup ONLY
    };

    users.push(newUser); // Add the new user to the array
    saveUsers(users); // <-- This is the magic line that saves it persistently

    const { password: _, ...userWithoutPassword } = newUser;
    return Promise.resolve(userWithoutPassword);
};