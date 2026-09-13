import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://lahari-books-backend.onrender.com/api", // Points to your Node Express server
});

export default api;