const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const authFetch = async (endpoint, options = {}) => {
    const res = await fetch(`${serverUrl}${endpoint}`, {
        ...options,
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (res.status === 401) {
        return { success: false, user: null };
    }

    return res.json();
};