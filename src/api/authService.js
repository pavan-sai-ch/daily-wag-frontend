import { mockUsers } from './mockData';

// Function to simulate a network request delay
const simulateNetworkRequest = (delay = 500) => {
    return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates a login API call.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - A promise that resolves with the user object or rejects with an error.
 */
export const login = async (email, password) => {
    await simulateNetworkRequest();

    const user = mockUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (user && user.password === password) {
        // In a real app, you would return a token, not the full user object with password.
        const { password: _, ...userWithoutPassword } = user;
        return Promise.resolve(userWithoutPassword);
    } else {
        return Promise.reject(new Error('Invalid email or password.'));
    }
};

/**
 * Simulates a signup API call.
 * @param {object} userData - The new user's data (firstName, lastName, email, password).
 * @returns {Promise<object>} - A promise that resolves with the new user object or rejects with an error.
 */
export const signup = async (userData) => {
    await simulateNetworkRequest();

    const { email, firstName, lastName, password } = userData;
    const emailExists = mockUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
        return Promise.reject(new Error('An account with this email already exists.'));
    }

    // Create the new user object
    const newUser = {
        id: `user${Math.floor(Math.random() * 1000)}`, // Generate a random ID
        role: 'customer',
        firstName,
        lastName,
        email,
        password, // Storing plain text password for this mock setup ONLY
    };

    // Add the new user to our mock "database"
    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return Promise.resolve(userWithoutPassword);
};