const getApiUrl = () => {
    // Priority 1: Environment Variable (if set)
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // Priority 2: Smart Detection
    // If running on localhost, default to local backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5001';
    }

    // Priority 3: Production Fallback (Vercel/Mobile)
    // If we are here, we are on the deployed site but VITE_API_URL is missing/empty.
    // Fallback to the known production backend.
    return 'https://yenepoya-student-hub.onrender.com';
};

export const API_URL = getApiUrl();
