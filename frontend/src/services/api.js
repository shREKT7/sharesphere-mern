import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Mapped through Vite Proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const userinfo = localStorage.getItem('userInfo');
        if (userinfo) {
            const parsed = JSON.parse(userinfo);
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
