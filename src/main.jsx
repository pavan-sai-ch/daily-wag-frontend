import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import './assets/styles/global.css';

import { initializePetDatabase, initializeImmunizationDatabase } from './api/petService.js'; // Import new initializer
import { initializeAppointmentDatabase } from './api/appointmentService.js'; // Import new initializer


import { initializeUserDatabase } from './api/authService.js';
// --- RUN THE INITIALIZERS ---
initializeUserDatabase();
initializePetDatabase();
initializeAppointmentDatabase(); // Add this line
initializeImmunizationDatabase(); // Add this line

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);