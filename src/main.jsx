import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import './assets/styles/global.css';

// --- IMPORT THE INITIALIZERS ---
// import { initializeUserDatabase } from './api/authService.js';
// import { initializePetDatabase } from './api/petService.js';
import { initializeUserDatabase } from './api/authService.js';
import {initializePetDatabase} from "./api/petService.js";
// --- RUN THE INITIALIZERS ---
initializeUserDatabase();
initializePetDatabase();

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);