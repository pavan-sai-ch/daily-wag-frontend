/**
 * Checks if a name is provided (not just empty spaces).
 * @param {string} name - The name to validate.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
export const validateName = (name) => {
    return name.trim().length > 0;
};

/**
 * Checks if an email has a valid format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Checks a password against a set of security rules.
 * @param {string} password - The password to validate.
 * @returns {string[]} - An array of error messages. An empty array means the password is valid.
 */
export const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Must contain at least one uppercase letter.');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Must contain at least one number.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Must contain at least one special character.');
    }

    return errors;
};


/**
 * Checks which password criteria have been met.
 * @param {string} password - The password to check.
 * @returns {object} - An object with boolean values for each criterion.
 */
export const checkPasswordCriteria = (password) => {
    const criteria = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return criteria;
};