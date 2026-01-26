import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const { data } = await axios.get(`${apiUrl}/api/auth/profile?t=${Date.now()}`, { withCredentials: true });
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
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        await axios.post(`${apiUrl}/api/auth/logout`);
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
