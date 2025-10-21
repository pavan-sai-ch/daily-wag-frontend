import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/global.css';
import {Provider} from "react-redux"; //context provider to manage all context
import {store} from './store/store.js';
const rootElement = document.getElementById('app');
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);