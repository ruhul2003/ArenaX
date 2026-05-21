'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditFacilityPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        facility_type: '',
        location: '',
        price_per_hour: '',
        capacity: '',
        description: '',
        image: ''
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/facilities/${id}`);
                
                if (!response.ok) {
                    throw new Error("Could not load facility details from the server.");
                }
                
                const result = await response.json();
                if (result.success && result.data) {
                    setFormData({
                        name: result.data.name || '',
                        facility_type: result.data.facility_type || '',
                        location: result.data.location || '',
                        price_per_hour: result.data.price_per_hour || '',
                        capacity: result.data.capacity || '',
                        description: result.data.description || '',
                        image: result.data.image || ''
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch(`/api/facilities/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to update record.");
            }

            alert("Facility updated successfully!");
            router.push('/manage-facilities');
            router.refresh(); 
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#031637] text-[#00D4FF] flex items-center justify-center">
                <p className="animate-pulse">Loading facility information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/20 max-w-md w-full p-6 rounded-2xl text-center">
                    <p className="text-red-400 font-medium mb-4">{error}</p>
                    <button onClick={() => router.push('/manage-facilities')} className="text-[#00D4FF] text-sm underline">
                        Back to Management Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Edit Facility Details</h1>
                    <p className="text-white/50 text-xs mt-1">Updating Reference ID: <span className="text-[#00D4FF] font-mono">{id}</span></p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Facility Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-[#041c44] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Facility Type</label>
                            <input type="text" name="facility_type" value={formData.facility_type} onChange={handleChange} required className="w-full bg-[#041c44] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-[#041c44] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Price Per Hour ($)</label>
                            <input type="number" name="price_per_hour" value={formData.price_per_hour} onChange={handleChange} required className="w-full bg-[#041c44] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Max Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full bg-[#041c44] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Image URL</label>
                        <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-[#041c44] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Description</label>
                        <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full bg-[#041c44] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] resize-none"></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={() => router.push('/manage-facilities')} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 hover:bg-white/5 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="bg-[#00D4FF] text-[#031637] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#00b2d6] disabled:opacity-50 transition-all">
                            {isSaving ? "Saving Updates..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}