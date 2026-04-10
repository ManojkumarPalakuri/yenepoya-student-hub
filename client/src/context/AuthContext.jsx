import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        if (localStorage.getItem('isGuest') === 'true') {
            const guestUser = {
                id: 'guest',
                name: 'Guest User',
                email: 'guest@yenepoya.edu.in',
                role: 'student',
                isGuest: true
            };
            setUser(guestUser);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`${API_URL}/api/auth/profile?t=${Date.now()}`, { withCredentials: true });
            setUser(data);
        } catch (error) {
            setUser(null);
            if (localStorage.getItem('token')) {
                localStorage.removeItem('token');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Interceptor to inject token
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Dynamic interceptor to handle token updates
        const reqInterceptor = axios.interceptors.request.use(
            (config) => {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    config.headers.Authorization = `Bearer ${storedToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        axios.defaults.withCredentials = true; // Important for cookies
        checkUserLoggedIn();

        return () => {
            axios.interceptors.request.eject(reqInterceptor);
        };
    }, []);

    // Generic login that takes the user data directly (from backend response)
    const login = async (userData) => {
        if (userData.token) {
            localStorage.setItem('token', userData.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
        setUser(userData);
    };

    const loginAsGuest = () => {
        localStorage.setItem('isGuest', 'true');
        const guestUser = {
            id: 'guest',
            name: 'Guest User',
            email: 'guest@yenepoya.edu.in',
            role: 'student', // allows PrivateRoute to pass
            isGuest: true
        };
        setUser(guestUser);
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (e) {
            console.error('Logout failed', e);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('isGuest');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        loginAsGuest,
        logout,
        checkUserLoggedIn
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
