// src/lib/api.js
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const authFetch = async (endpoint, options = {}) => {
    const res = await fetch(`${serverUrl}${endpoint}`, {
        ...options,
        credentials: 'include', // This is the secret sauce
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (res.status === 401) {
        // Handle unauthorized globally if needed
        return { success: false, user: null };
    }

    return res.json();
};