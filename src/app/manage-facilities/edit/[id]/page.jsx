// src/app/manage-facilities/edit/[id]/page.jsx
export default async function EditFacilityPage({ params }) {
    // Await params in Next.js App Router
    const { id } = await params; 
    
    return (
        <div className="min-h-screen bg-[#031637] text-white p-10">
            <h1 className="text-2xl font-bold">Edit Facility Reference ID: {id}</h1>
            {/* Render your edit form component here */}
        </div>
    );
}