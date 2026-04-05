import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', 
    withCredentials: true, 
});

let memoryToken = null;

export const setAxiosToken = (token) => {
    memoryToken = token;
};

api.interceptors.request.use(
    (config) => {
        if (memoryToken) {
            config.headers.Authorization = `Bearer ${memoryToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
