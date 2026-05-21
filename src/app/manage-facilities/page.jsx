'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Edit3, MapPin } from 'lucide-react';

const ManageMyFacilities = () => {
    const router = useRouter();
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetches only the current user's documents
    const fetchFacilities = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/facilities');

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Please log in to view your facilities.");
                }
                throw new Error(`Error ${response.status}: Failed to load data`);
            }

            const result = await response.json();
            const facilitiesData = Array.isArray(result) ? result : result.data || [];
            setFacilities(facilitiesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Fixed Delete Handler: Communicates directly via query parameters
    const handleDelete = async (facilityId) => {
        if (!window.confirm("Are you absolutely sure you want to delete this facility? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`/api/facilities?id=${facilityId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete the facility.");
            }

            // Remove from local UI state instantly upon database confirmation
            setFacilities((prevFacilities) => 
                prevFacilities.filter((facility) => (facility._id || facility.id) !== facilityId)
            );
            
            alert("Facility deleted successfully.");
        } catch (err) {
            console.error("Delete Error:", err);
            alert(err.message || "An error occurred while trying to delete.");
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white/70 animate-pulse">Loading your facilities...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/20 max-w-md w-full p-6 rounded-2xl text-center">
                    <p className="text-red-400 font-medium mb-4">{error}</p>
                    <button
                        onClick={fetchFacilities}
                        className="bg-[#00D4FF] text-[#031637] px-6 py-2 rounded-xl font-semibold hover:bg-[#00B8E0] transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] text-white py-10 px-5 md:px-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-5">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manage My Facilities</h1>
                        <p className="text-white/60 text-sm mt-1">Review, edit, or remove athletic facilities you have hosted.</p>
                    </div>
                    <button
                        onClick={() => router.push('/add-facility')}
                        className="bg-[#00D4FF] text-[#031637] font-semibold px-5 py-2.5 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all text-center self-start sm:self-auto"
                    >
                        + Add New Facility
                    </button>
                </div>

                {facilities.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center max-w-xl mx-auto mt-10">
                        <p className="text-white/70 text-lg mb-6">You haven't listed any facilities yet.</p>
                        <button
                            onClick={() => router.push('/add-facility')}
                            className="border border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-[#031637] transition duration-200 px-6 py-2.5 rounded-xl font-medium"
                        >
                            List Your First Facility
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((facility) => {
                            const facilityId = facility._id || facility.id;
                            return (
                                <div
                                    key={facilityId}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition group flex flex-col justify-between"
                                >
                                    {/* Facility Card Thumbnail */}
                                    <div className="relative h-48 w-full bg-white/10">
                                        {facility.image || facility.imageUrl ? (
                                            <Image
                                                src={facility.image || facility.imageUrl}
                                                alt={facility.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={false}
                                                className="object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                                                No Image Available
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Details */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1">{facility.name}</h3>
                                            <div className="flex items-center gap-1.5 text-white/60 text-sm mt-2">
                                                <MapPin size={16} className="text-[#00D4FF]" />
                                                <span className="line-clamp-1">{facility.location}</span>
                                            </div>
                                            <p className="text-white/80 text-sm mt-3 line-clamp-2">
                                                {facility.description || "No description provided for this listing."}
                                            </p>
                                        </div>

                                        {/* Actions Row */}
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                                            <span className="text-[#00D4FF] font-bold text-lg">
                                                ${facility.price_per_hour || facility.pricePerHour || 0}
                                                <span className="text-xs text-white/50 font-normal">/hr</span>
                                            </span>

                                            <div className="flex items-center gap-2">
                                                {/* ✅ FIXED ROUTE DIRECTION TO EDIT PAGE */}
                                                <button
                                                    onClick={() => router.push(`/manage-facilities/edit/${facilityId}`)}
                                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition"
                                                    title="Edit Facility"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(facilityId)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition"
                                                    title="Delete Facility"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMyFacilities;