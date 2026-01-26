import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        try {
            // Using a hack for now since we don't have a dedicated "verify" endpoint ready, 
            // but we can use /profile if cookie exists
            // We need to set axios defaults to include credentials
            const { data } = await axios.get(`http://localhost:5001/api/auth/profile?t=${Date.now()}`, { withCredentials: true });
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
        await axios.post('http://localhost:5001/api/auth/logout');
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
