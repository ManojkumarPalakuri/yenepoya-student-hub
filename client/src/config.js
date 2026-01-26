const getApiUrl = () => {
    // If VITE_API_URL is set (in .env or Vercel dashboard), use it.
    // Otherwise, default to localhost for development.
    return import.meta.env.VITE_API_URL || 'https://yenepoya-student-hub.onrender.com';
};

export const API_URL = getApiUrl();
