'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, MapPin, Loader2, Plus, Users, Calendar, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { authClient } from "@/lib/auth-client"; 
import { toast } from 'react-hot-toast';   // ← Added

const ManageMyFacilities = () => {
    const router = useRouter();
    const [facilities, setFacilities] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // Retrieve auth session state directly from authClient
    const { data: session, isPending: isAuthLoading } = authClient.useSession();
    const user = session?.user;


    const fetchMyFacilities = useCallback(async () => {

        if (!user || !user?.email) return;

        try {
            setIsLoadingData(true);
            setError(null); 
            
            // ইমেইল স্ট্রিংটিকে ব্যাকএন্ডের জন্য নরমাল ফরম্যাটে পাঠাতে সরাসরি পাস করা হলো
            const targetUrl = `${serverUrl}/api/my-facilities?email=${user.email}`;
            
            const response = await fetch(targetUrl, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to fetch facilities');
            }

            const data = await response.json();
            
            // Handle wrapper payloads gracefully if present
            const resolvedData = data.data !== undefined ? data.data : data;
            setFacilities(Array.isArray(resolvedData) ? resolvedData : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setFacilities([]);
        } finally {
            setIsLoadingData(false);
        }
    }, [serverUrl, user]); // dependency তে পুরো user অবজেক্ট ট্র্যাক করা হলো

    // Triggers cleanly whenever the authenticated user state changes
    useEffect(() => {
        let isMounted = true;

        if (user?.email && isMounted) {
            fetchMyFacilities();
        }

        return () => {
            isMounted = false;
        };
    }, [user?.email, fetchMyFacilities]);

const handleDelete = async (id, name) => {
    // Show confirmation toast instead of window.confirm
    const isConfirmed = window.confirm(`Are you absolutely sure you want to delete "${name}"? This action cannot be undone.`);

    if (!isConfirmed) return;

    setDeletingId(id);

    try {
        const response = await fetch(`${serverUrl}/api/facility/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(result.message || "Failed to delete facility");
        }

        // Success Toast
        toast.success(`Facility "${name}" has been successfully deleted!`, {
            duration: 4000,
            position: 'top-right',
        });

        // Remove from UI
        setFacilities(prev => prev.filter(item => item._id !== id));

    } catch (error) {
        console.error("Deletion error:", error);
        toast.error(error.message || "Failed to delete facility. Please try again.");
    } finally {
        setDeletingId(null);
    }
};

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // 1. Render global spinner ONLY while authentication status is actively verifying
    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-[#031637] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin" />
            </div>
        );
    }

    // 2. Safely block anonymous access after verification complete
    if (!user) {
        return (
            <div className="min-h-screen bg-[#031637] text-slate-200 py-16 px-6 flex flex-col items-center justify-center gap-4">
                <AlertTriangle size={40} className="text-amber-400" />
                <h1 className="text-2xl font-bold">Authentication Required</h1>
                <p className="text-white/60">Please sign in to view your personalized facility dashboard tracking records.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Facilities</h1>
                        <p className="text-white/60">Manage your venue listings, pricing, and availability.</p>
                    </div>
                    <button 
                        onClick={() => router.push('/add-facility')}
                        className="bg-[#00D4FF] text-[#031637] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition shadow-lg shadow-[#00D4FF]/10"
                    >
                        <Plus size={20} /> Add New Facility
                    </button>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                
                {/* 3. Render contextual table loaders distinctly from authorization checks */}
                {isLoadingData ? (
                    <div className="bg-[#0A1F3D] border border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-[#00D4FF] animate-spin" />
                        <p className="text-white/50 text-sm">Retrieving listed items...</p>
                    </div>
                ) : facilities.length === 0 ? (
                    <div className="bg-[#0A1F3D] border border-white/10 rounded-3xl p-16 text-center">
                        <p className="text-xl text-white/50">You have not listed any facilities yet.</p>
                    </div>
                ) : (
                    <div className="bg-[#0A1F3D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-6">Facility Details</th>
                                    <th className="p-6">Sport/Type</th>
                                    <th className="p-6">Capacity</th>
                                    <th className="p-6">Price/Hr</th>
                                    <th className="p-6">Listed Date</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {facilities.map((f) => (
                                    <tr key={f._id} className="hover:bg-white/5 transition group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#031637] border border-white/10 flex-shrink-0 relative group-hover:border-[#00D4FF]/40 transition">
                                                    {f.image ? (
                                                        <Image 
                                                            src={f.image} 
                                                            alt={f.name} 
                                                            fill
                                                            className="w-full h-full object-cover"
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-white/30 font-semibold uppercase bg-gradient-to-br from-white/5 to-white/10">
                                                            {f.name?.slice(0, 2) || 'NA'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg group-hover:text-[#00D4FF] transition">{f.name}</div>
                                                    <div className="text-sm text-white/50 flex items-center gap-1 mt-1">
                                                        <MapPin size={14} className="text-white/40" /> {f.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="p-6">
                                            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm font-medium tracking-wide">
                                                {f.facility_type || f.facilityType || 'Sports'}
                                            </span>
                                        </td>
                                        
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-white/80">
                                                <Users size={16} className="text-[#00D4FF]/70" /> 
                                                <span>{f.capacity || 'N/A'}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="p-6 font-bold text-[#00D4FF] text-lg">
                                            ৳{f.price_per_hour || f.pricePerHour}
                                        </td>

                                        <td className="p-6 text-white/70">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={14} className="text-white/30" />
                                                <span>{formatDate(f.createdAt || f.date)}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="p-6 text-right space-x-2 whitespace-nowrap">
                                            <button 
                                                onClick={() => router.push(`/manage-facilities/edit/${f._id}`)} 
                                                disabled={deletingId === f._id}
                                                className="p-2.5 bg-white/5 hover:bg-[#00D4FF] text-white/80 hover:text-[#031637] rounded-xl border border-white/5 transition disabled:opacity-50"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(f._id, f.name)} 
                                                disabled={deletingId === f._id}
                                                className="p-2.5 bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-red-400 rounded-xl border border-white/5 hover:border-red-500/40 transition disabled:opacity-50"
                                            >
                                                {deletingId === f._id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMyFacilities;