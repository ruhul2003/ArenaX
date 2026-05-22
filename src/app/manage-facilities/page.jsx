'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Edit3, MapPin } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const ManageMyFacilities = () => {
    const router = useRouter();
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { data: session } = authClient.useSession();
    const userEmail = session?.user?.email;

    const fetchMyFacilities = async () => {
        if (!userEmail) {
            setError("Please log in to view your facilities.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
            
            const response = await fetch(`${serverUrl}/facilities?owner_email=${encodeURIComponent(userEmail)}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Session expired. Please log in again.");
                }
                throw new Error("Failed to load your facilities");
            }

            const result = await response.json();
            setFacilities(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (facilityId) => {
        if (!window.confirm("Are you sure you want to delete this facility?")) return;

        try {
            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
            const response = await fetch(`${serverUrl}/facilities/${facilityId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error("Failed to delete facility");

            setFacilities(prev => prev.filter(f => (f._id || f.id) !== facilityId));
            alert("Facility deleted successfully.");
        } catch (err) {
            alert(err.message || "Delete failed");
        }
    };

    useEffect(() => {
        fetchMyFacilities();
    }, [userEmail]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white/70">Loading your facilities...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/20 max-w-md w-full p-6 rounded-2xl text-center">
                    <p className="text-red-400">{error}</p>
                    <button onClick={fetchMyFacilities} className="mt-4 bg-[#00D4FF] text-black px-6 py-2 rounded-xl">
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
                        <h1 className="text-3xl font-bold">Manage My Facilities</h1>
                        <p className="text-white/60 mt-1">You have listed {facilities.length} facility(s)</p>
                    </div>
                    <button
                        onClick={() => router.push('/add-facility')}
                        className="bg-[#00D4FF] text-[#031637] font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
                    >
                        + Add New Facility
                    </button>
                </div>

                {facilities.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-white/70 text-lg">You have not added any facilities yet.</p>
                        <button
                            onClick={() => router.push('/add-facility')}
                            className="mt-6 bg-[#00D4FF] text-[#031637] px-8 py-3 rounded-xl font-semibold"
                        >
                            Add Your First Facility
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((facility) => {
                            const facilityId = facility._id || facility.id;
                            return (
                                <div key={facilityId} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition">
                                    <div className="relative h-48">
                                        <Image
                                            src={facility.image || '/placeholder.jpg'}
                                            alt={facility.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-lg">{facility.name}</h3>
                                        <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1">
                                            <MapPin size={16} />
                                            <span>{facility.location}</span>
                                        </div>

                                        <p className="text-white/70 text-sm mt-3 line-clamp-2">
                                            {facility.description}
                                        </p>

                                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-[#00D4FF] font-bold">
                                                ৳{facility.price_per_hour}/hr
                                            </span>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/manage-facilities/edit/${facilityId}`)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(facilityId)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
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