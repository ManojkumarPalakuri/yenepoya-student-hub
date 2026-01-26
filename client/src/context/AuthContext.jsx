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
        axios.defaults.withCredentials = true; // Important for cookies
        checkUserLoggedIn();
    }, []);

    // Generic login that takes the user data directly (from backend response)
    const login = async (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
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
