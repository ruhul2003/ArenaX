'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, MapPin, Loader2, Plus, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ManageMyFacilities = () => {
    const router = useRouter();
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    const fetchMyFacilities = async () => {
        try {
            const response = await fetch(`${serverUrl}/api/my-facilities`, { credentials: 'include' });
            if (response.status === 401) return router.push('/login');
            setFacilities(await response.json());
        } catch (err) { 
            console.error("Fetch error:", err); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(`Are you absolutely sure you want to delete "${name}"? This action cannot be undone.`);
        if (!confirmed) return;

        try {
            const response = await fetch(`${serverUrl}/api/facility/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server did not return valid JSON data. Verify backend routing specifications.");
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to remove the facility listing.");
            }

            alert("Facility successfully removed!");
            setFacilities(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error("Deletion error:", error);
            alert(error.message);
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

    useEffect(() => { fetchMyFacilities(); }, []);

    if (isLoading) return <div className="min-h-screen bg-[#031637] flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin" /></div>;

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
                
                {facilities.length === 0 ? (
                    <div className="bg-[#0A1F3D] border border-white/10 rounded-3xl p-16 text-center">
                        <p className="text-xl text-white/50">You haven't listed any facilities yet.</p>
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
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-white/30 font-semibold uppercase bg-gradient-to-br from-white/5 to-white/10">
                                                            {f.name.slice(0, 2)}
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
                                                {f.facility_type || 'Sports'}
                                            </span>
                                        </td>
                                        
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-white/80">
                                                <Users size={16} className="text-[#00D4FF]/70" /> 
                                                <span>{f.capacity || 'N/A'}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="p-6 font-bold text-[#00D4FF] text-lg">
                                            ৳{f.price_per_hour}
                                        </td>

                                        <td className="p-6 text-white/70">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={14} className="text-white/30" />
                                                <span>{formatDate(f.createdAt)}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="p-6 text-right space-x-2 whitespace-nowrap">
                                            <button 
                                                onClick={() => router.push(`/manage-facilities/edit/${f._id}`)} 
                                                className="p-2.5 bg-white/5 hover:bg-[#00D4FF] text-white/80 hover:text-[#031637] rounded-xl border border-white/5 transition"
                                                title="Edit Listing"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(f._id, f.name)} 
                                                className="p-2.5 bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-red-400 rounded-xl border border-white/5 hover:border-red-500/40 transition"
                                                title="Delete Listing"
                                            >
                                                <Trash2 size={16} />
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