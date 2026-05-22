export const getFacilities = async (ownerEmail = "") => {
    try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
        
        let url = `${serverUrl}/api/facilities`;
        if (ownerEmail) {
            url += `?owner_email=${ownerEmail}`;
        }

        console.log("📡 Frontend fetching facilities from:", url);

        const res = await fetch(url, { 
            cache: 'no-store' 
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Expected JSON from backend, but received HTML structure instead.");
            return [];
        }

        if (!res.ok) {
            throw new Error(`Failed to fetch facilities: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error inside getFacilities utility:", error);
        return []; 
    }
};