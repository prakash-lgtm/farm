import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, verify token with backend
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, theme, toggleTheme }}>
            {children}
        </AuthContext.Provider>
    );
};
