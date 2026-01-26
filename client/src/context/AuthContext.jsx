import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/auth/profile?t=${Date.now()}`, { withCredentials: true });
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        axios.defaults.withCredentials = true; // Important for cookies (hybrid approach)
        checkUserLoggedIn();
    }, []);

    const login = async (userData) => {
        if (userData.token) {
            localStorage.setItem('token', userData.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.error('Logout failed', error);
        }
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        checkUserLoggedIn
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
