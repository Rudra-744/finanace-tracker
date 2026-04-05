import { createContext, useState, useEffect } from 'react';
import api, { setAxiosToken } from '../utils/axios.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        const refreshAccessToken = async () => {
            try {
                const res = await api.post('/auth/refresh-token');
                setToken(res.data.accessToken);
                setAxiosToken(res.data.accessToken);
            } catch (error) {
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        refreshAccessToken();
    }, []);

    const login = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);
        setAxiosToken(accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setAxiosToken(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
