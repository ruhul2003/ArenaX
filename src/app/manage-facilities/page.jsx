'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, MapPin, Loader2, Plus, Users, ShieldCheck, Tag } from 'lucide-react';

const ManageMyFacilities = () => {
    const router = useRouter();
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyFacilities = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/my-facilities`, { credentials: 'include' });
            if (response.status === 401) return router.push('/login');
            setFacilities(await response.json());
        } catch (err) { console.error("Fetch error:", err); }
        finally { setIsLoading(false); }
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
                        className="bg-[#00D4FF] text-[#031637] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition"
                    >
                        <Plus size={20} /> Add New Facility
                    </button>
                </div>
                
                {facilities.length === 0 ? (
                    <div className="bg-[#0A1F3D] border border-white/10 rounded-3xl p-16 text-center">
                        <p className="text-xl text-white/50">You haven't listed any facilities yet.</p>
                    </div>
                ) : (
                    <div className="bg-[#0A1F3D] border border-white/10 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10 text-white/50 text-sm uppercase">
                                <tr>
                                    <th className="p-6">Facility</th>
                                    <th className="p-6">Sport/Type</th>
                                    <th className="p-6">Capacity</th>
                                    <th className="p-6">Price/Hr</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {facilities.map((f) => (
                                    <tr key={f._id} className="hover:bg-white/5 transition">
                                        <td className="p-6">
                                            <div className="font-bold">{f.name}</div>
                                            <div className="text-sm text-white/50 flex items-center gap-1 mt-1"><MapPin size={14} /> {f.location}</div>
                                        </td>
                                        <td className="p-6"><span className="bg-white/10 px-3 py-1 rounded-full text-sm">{f.facility_type || 'Sports'}</span></td>
                                        <td className="p-6 flex items-center gap-2"><Users size={16} className="text-[#00D4FF]" /> {f.capacity || 'N/A'}</td>
                                        <td className="p-6 font-bold text-[#00D4FF]">৳{f.price_per_hour}</td>
                                        <td className="p-6 text-right space-x-2">
                                            <button onClick={() => router.push(`/manage-facilities/edit/${f._id}`)} className="p-2 bg-white/5 hover:bg-[#00D4FF] hover:text-[#031637] rounded-lg transition"><Edit3 size={18} /></button>
                                            <button className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition"><Trash2 size={18} /></button>
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