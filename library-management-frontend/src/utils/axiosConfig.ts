import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            switch (error.response.status) {
                case 401:
                    toast.error('Unauthorized: Please login again');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    toast.error('Forbidden: You do not have permission to perform this action');
                    break;
                case 404:
                    toast.error('Resource not found');
                    break;
                case 429:
                    toast.error('Too many requests. Please try again later');
                    break;
                case 500:
                    toast.error('Server error. Please try again later');
                    break;
                default:
                    toast.error(error.response.data?.message || 'An error occurred');
            }
        } else if (error.request) {
            // The request was made but no response was received
            toast.error('Network error. Please check your connection');
        } else {
            // Something happened in setting up the request that triggered an Error
            toast.error('An unexpected error occurred');
        }
        return Promise.reject(error);
    }
);

export default api; 