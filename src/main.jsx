import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/global.css'; // Import global styles

// Find the root DOM element from the index.html file
const rootElement = document.getElementById('app');

// Create a root for the React application
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root element
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);