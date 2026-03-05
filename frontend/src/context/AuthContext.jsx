import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const userInfoStr = localStorage.getItem('userInfo');
            if (userInfoStr) {
                try {
                    const parsed = JSON.parse(userInfoStr);
                    // Verify token is still good
                    const { data } = await api.get('/auth/me');
                    if (data.success) {
                        setUser(parsed);
                    }
                } catch (error) {
                    console.error("Token verification failed", error);
                    localStorage.removeItem('userInfo');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                const userData = { _id: data._id, name: data.name, email: data.email, role: data.role, token: data.token };
                setUser(userData);
                localStorage.setItem('userInfo', JSON.stringify(userData));
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            if (data.success) {
                const userData = { _id: data._id, name: data.name, email: data.email, role: data.role, token: data.token };
                setUser(userData);
                localStorage.setItem('userInfo', JSON.stringify(userData));
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
