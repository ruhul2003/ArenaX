'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AllFacilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await fetch('http://localhost:5000/facilities');
                const data = await res.json();
                setFacilities(data);
            } catch (error) {
                console.error('Error fetching facilities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    const filteredFacilities = facilities.filter(facility =>
        facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#031637] flex items-center justify-center">
                <p className="text-white text-xl">Loading facilities...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            All Facilities
                        </h1>
                        <p className="text-white/70 mt-2 text-lg">
                            {filteredFacilities.length} sports venues available
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 md:mt-0">
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#0A1F3D] border border-white/10 rounded-2xl px-6 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] w-full md:w-96"
                        />
                    </div>
                </div>

                {/* Facilities Grid */}
                {filteredFacilities.length === 0 ? (
                    <div className="text-center py-20 text-white/60 text-xl">
                        No facilities found matching your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFacilities.map((facility) => (
                            <div
                                key={facility._id || facility.id}
                                className="bg-[#0A1F3D] rounded-3xl flex flex-col justify-between overflow-hidden group hover:shadow-2xl hover:shadow-[#00D4FF]/10 transition-all duration-300 border border-white/5 hover:border-[#00D4FF]/30"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={facility.image || '/placeholder.jpg'}
                                        alt={facility.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-full">
                                        {facility.sportType || facility.facility_type || 'Multi-Sport'}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold text-white line-clamp-2">
                                        {facility.name}
                                    </h3>

                                    <p className="text-white/60 text-sm mt-1">
                                        {facility.location}
                                    </p>

                                    {/* Rating & Price */}
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[#00D4FF]">★</span>
                                            <span className="text-white font-medium">
                                                {facility.booking_count}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[#00D4FF] font-bold text-xl">
                                                ৳{facility.price_per_hour}
                                            </span>
                                            <span className="text-white/50 text-sm">/hr</span>
                                        </div>
                                    </div>

                                    <Link 
                                        href={`/facility/${facility._id?.toString() || facility.id}`}
                                        className="mt-auto pt-6"
                                    >
                                        <button className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                                            View Details & Book
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllFacilities;