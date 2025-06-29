// src/axiosConfig.js (or any central place like main.jsx/main.tsx)
import axios from 'axios';

// Get the base URL from your .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Set the global default base URL for all Axios requests
axios.defaults.baseURL = API_BASE_URL;

// Optional: Add common headers here too if needed
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios; // Export the configured default instance