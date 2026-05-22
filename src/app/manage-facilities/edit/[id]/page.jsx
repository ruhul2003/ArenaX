'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';

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

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // 🛠️ FIXED: Plural /api/facilities changed to singular matching your project's architecture
                const response = await fetch(`${serverUrl}/api/facility/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                
                // Handle non-JSON or missing endpoints gracefully before calling .json()
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Received an unexpected non-JSON response from server. Check your backend routing definitions.");
                }

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Could not load facility details from the server.");
                }
                
                const facilityData = result.data || result;
                
                if (facilityData) {
                    setFormData({
                        name: facilityData.name || '',
                        facility_type: facilityData.facility_type || facilityData.facilityType || '',
                        location: facilityData.location || '',
                        price_per_hour: facilityData.price_per_hour || facilityData.pricePerHour || '',
                        capacity: facilityData.capacity || '',
                        description: facilityData.description || '',
                        image: facilityData.image || ''
                    });
                }
            } catch (err) {
                console.error("Fetch facility error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id, serverUrl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        
        try {
            const payload = {
                ...formData,
                price_per_hour: parseFloat(formData.price_per_hour) || 0,
                capacity: parseInt(formData.capacity, 10) || 0
            };

            // 🛠️ FIXED: Endpoint altered from /api/facilities/${id} to singular /api/facility/${id}
            const response = await fetch(`${serverUrl}/api/facility/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server failed to respond with JSON format. Ensure backend endpoints match exactly.");
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || data.error || "Failed to update record.");
            }

            alert("Facility updated successfully!");
            router.push('/manage-facilities');
            router.refresh(); 
        } catch (err) {
            console.error("Update request error:", err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#031637] text-[#00D4FF] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-white/70 text-sm">Loading facility configuration...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-[#0A1F3D] border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="mb-6">
                    <button 
                        onClick={() => router.push('/manage-facilities')}
                        className="text-white/50 hover:text-white flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-3 transition"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Edit Facility Details</h1>
                    <p className="text-white/50 text-xs mt-1">
                        Updating Reference ID: <span className="text-[#00D4FF] font-mono">{id}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-5 text-xs flex items-start gap-2.5">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Facility Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={isSaving} className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition disabled:opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Facility Type</label>
                            <input type="text" name="facility_type" value={formData.facility_type} onChange={handleChange} required disabled={isSaving} placeholder="e.g. Football Turf" className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required disabled={isSaving} className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition disabled:opacity-50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Price Per Hour (৳)</label>
                            <input type="number" name="price_per_hour" value={formData.price_per_hour} onChange={handleChange} required disabled={isSaving} min="0" step="any" className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Max Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required disabled={isSaving} min="1" className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition disabled:opacity-50" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Image URL</label>
                        <input type="url" name="image" value={formData.image} onChange={handleChange} disabled={isSaving} placeholder="https://example.com/image.jpg" className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition disabled:opacity-50" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Description</label>
                        <textarea name="description" rows="3" value={formData.description} onChange={handleChange} disabled={isSaving} className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] resize-none transition disabled:opacity-50"></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={() => router.push('/manage-facilities')} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:bg-white/5 transition disabled:opacity-40">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="bg-[#00D4FF] hover:bg-[#00b2d6] disabled:opacity-50 text-[#031637] px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 shadow-md">
                            {isSaving ? "Saving Updates..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}