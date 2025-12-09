import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // Important for cookies/sessions
});

// Request interceptor to add access token if we were using headers instead of cookies
// For this project we are using HttpOnly cookies, BUT if we needed to send it in header:
/*
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
*/

// Response interceptor for handling errors & token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Here we would implement refresh token logic if we had a dedicated refresh endpoint
            // Since our backend sets cookies, the browser handles sending them.
            // If we get 401 here, it means both access and refresh tokens are likely expired or invalid.
            // We might redirect to login.

            // For now, just reject.
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    register: (data) => api.post('/users/register', data),
    login: (data) => api.post('/users/login', data),
    logout: () => api.post('/users/logout'),
};

// Payment Services
export const paymentService = {
    createOrder: (data) => api.post('/payments/order', data),
    verifyPayment: (data) => api.post('/payments/verify', data),
};

// Group Services
export const groupService = {
    createGroup: (data) => api.post('/groups', data),
    getUserGroups: () => api.get('/groups'),
    addMember: (groupId, data) => api.post(`/groups/${groupId}/members`, data),
    addExpense: (groupId, data) => api.post(`/groups/${groupId}/expenses`, data),
};

export default api;
