'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function EditFacilityPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price_per_hour: '',
        capacity: '',
        image: '',
        description: '',
        facility_type: 'Sports'
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchFacilityDetails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${serverUrl}/api/facility/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch facility data.');
                }

                const data = await response.json();
                const actualData = data.data || data;
                
                setFormData({
                    name: actualData.name || '',
                    location: actualData.location || '',
                    price_per_hour: actualData.price_per_hour || '',
                    capacity: actualData.capacity || '',
                    image: actualData.image || '',
                    description: actualData.description || '',
                    facility_type: actualData.facility_type || 'Sports'
                });
            } catch (err) {
                console.error("Error loading facility:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchFacilityDetails();
    }, [id, serverUrl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch(`${serverUrl}/api/facility/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server did not return valid JSON. Verify backend endpoint routing mappings.");
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update facility modifications.');
            }

            alert('Facility structural updates saved successfully!');
            router.push('/manage-facilities');
        } catch (err) {
            console.error("Update request error:", err);
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#031637] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] text-white py-12 px-6">
            <div className="max-w-3xl mx-auto bg-[#0A1F3D] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <button 
                    onClick={() => router.push('/manage-facilities')}
                    className="text-white/60 hover:text-white flex items-center gap-2 mb-6 text-sm transition"
                >
                    <ArrowLeft size={16} /> Back to My Facilities
                </button>

                <h1 className="text-3xl font-bold mb-8">Edit Facility Profile</h1>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">Facility Name</label>
                            <input 
                                type="text" name="name" value={formData.name} onChange={handleInputChange} required
                                className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF] transition text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">Location / Area</label>
                            <input 
                                type="text" name="location" value={formData.location} onChange={handleInputChange} required
                                className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF] transition text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">Price Per Hour (৳)</label>
                            <input 
                                type="number" name="price_per_hour" value={formData.price_per_hour} onChange={handleInputChange} required
                                className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF] transition text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">Max Capacity (Players)</label>
                            <input 
                                type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required
                                className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF] transition text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">Image URL</label>
                        <input 
                            type="text" name="image" value={formData.image} onChange={handleInputChange}
                            className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF] transition text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">Description</label>
                        <textarea 
                            name="description" value={formData.description} onChange={handleInputChange} rows="4"
                            className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00D4FF] transition text-white resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-[#00D4FF] hover:bg-[#00b2d6] text-[#031637] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Saving Form Alterations...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Save Dynamic Updates
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}