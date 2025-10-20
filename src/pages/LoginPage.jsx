import React, { useState } from 'react';
import './LoginPage.css';
import { validateEmail, validatePassword, validateName, checkPasswordCriteria } from '/src/utils/validation.js';
import { login, signup } from '/src/api/authService.js'; // Using the mock auth service
import PasswordCriteria from '/src/components/common/PasswordCriteria.jsx';

const LoginPage = () => {
    // State to toggle between Login and Sign Up views
    const [isLoginView, setIsLoginView] = useState(true);

    // State to hold form input data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // State to hold validation error messages for submission
    const [errors, setErrors] = useState({});

    // State to track password criteria in real-time
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    // State to handle loading feedback during API calls
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes and real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation for the password field as the user types
        if (name === 'password') {
            const criteriaMet = checkPasswordCriteria(value);
            setPasswordCriteria(criteriaMet);
        }
    };

    // Handle form submission and final validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        // --- Validation Logic ---
        const validationErrors = {};
        if (!validateEmail(formData.email)) {
            validationErrors.email = 'Please enter a valid email address.';
        }

        if (!isLoginView) {
            if (!validateName(formData.firstName)) {
                validationErrors.firstName = 'First name is required.';
            }
            if (!validateName(formData.lastName)) {
                validationErrors.lastName = 'Last name is required.';
            }
            const passwordErrors = validatePassword(formData.password);
            if (passwordErrors.length > 0) {
                validationErrors.password = 'Please meet all password requirements.';
            }
            if (formData.password !== formData.confirmPassword) {
                validationErrors.confirmPassword = 'Passwords do not match.';
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            if (isLoginView) {
                // --- MOCK API CALL FOR LOGIN ---
                const user = await login(formData.email, formData.password);

                /*
                // --- REAL BACKEND API CALL (Example) ---
                // const response = await axios.post('/api/login', {
                //   email: formData.email,
                //   password: formData.password
                // });
                // const user = response.data;
                */

                console.log('Login successful:', user);
                alert(`Welcome back, ${user.firstName}!`);
                // TODO: Redirect to dashboard, update global auth state
            } else {
                // --- MOCK API CALL FOR SIGNUP ---
                const newUser = await signup(formData);

                /*
                // --- REAL BACKEND API CALL (Example) ---
                // const response = await axios.post('/api/register', {
                //   firstName: formData.firstName,
                //   lastName: formData.lastName,
                //   email: formData.email,
                //   password: formData.password
                // });
                // const newUser = response.data;
                */

                console.log('Signup successful:', newUser);
                alert(`Account created for ${newUser.firstName}! You can now log in.`);
                setIsLoginView(true); // Switch to login view
            }
        } catch (error) {
            setErrors({ api: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-card">
                <h2>{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h2>
                <p>{isLoginView ? 'Log in to continue.' : 'Get started with The Daily Wag.'}</p>

                <form onSubmit={handleSubmit} noValidate>
                    {!isLoginView && (
                        <>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
                        {!isLoginView && <PasswordCriteria criteria={passwordCriteria} />}
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>

                    {!isLoginView && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                        </div>
                    )}

                    {errors.api && <p className="error-message api-error">{errors.api}</p>}

                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Loading...' : (isLoginView ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div className="toggle-view">
                    {isLoginView ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setErrors({}); }}>
                        {isLoginView ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
