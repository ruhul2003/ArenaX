'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedFacilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
                const res = await fetch(`${baseUrl}/api/facilities`);

                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.error("Expected JSON response, but received non-JSON content.");
                    setFacilities([]);
                    return;
                }

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setFacilities(data);
            } catch (error) {
                console.error('Error fetching facilities for featured section:', error);
                setFacilities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    // JavaScript-er `.slice(0, 4)` use kore prothom 4 ti facility neya holo
    const featuredFacilities = facilities.slice(0, 4);

    if (loading) {
        return (
            <div className="py-20 bg-[#031637] flex items-center justify-center">
                <p className="text-white text-xl">Loading featured venues...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#031637] py-16">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Featured Facilities
                        </h2>
                        <p className="text-white/70 mt-2 text-base">
                            Handpicked top-rated sports venues just for you
                        </p>
                    </div>
                    
                    {/* All facilities page-e jaoar link */}
                    <Link 
                        href="/all-facilities" 
                        className="text-[#00D4FF] hover:text-[#00B8E0] font-semibold text-sm transition-all duration-200 uppercase tracking-wider flex items-center gap-1"
                    >
                        View All Venues <span>→</span>
                    </Link>
                </div>

                {/* Facilities Grid (Shows maximum 4 items) */}
                {featuredFacilities.length === 0 ? (
                    <div className="text-center py-10 text-white/60 text-lg">
                        No featured facilities available right now.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featuredFacilities.map((facility) => (
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
                                                {facility.booking_count || 0}
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

export default FeaturedFacilities;