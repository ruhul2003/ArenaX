export const getFacilities = async () => {
    const res = await fetch('http://localhost:5000/facilities');
    const data = await res.json();
    return data;
}