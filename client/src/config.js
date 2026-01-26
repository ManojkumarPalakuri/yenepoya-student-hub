const getApiUrl = () => {
    // If VITE_API_URL is set (in .env or Vercel dashboard), use it.
    // Otherwise, default to localhost for development.
    return import.meta.env.VITE_API_URL || 'http://localhost:5001';
};

export const API_URL = getApiUrl();
