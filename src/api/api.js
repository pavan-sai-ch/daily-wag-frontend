import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    // The base URL for all your backend endpoints
    baseURL: 'http://localhost:8080/api',

    // CRITICAL: This tells the browser to include the HttpOnly cookie
    // (PHPSESSID) in every request. Without this, sessions won't work.
    withCredentials: true,

    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;