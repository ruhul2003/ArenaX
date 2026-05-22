import React from 'react';
import { cookies } from 'next/headers'; // ✅ Replaced Better-Auth headers with native Next cookies
import { getFacilities } from '../lib/data';
import Image from 'next/image';
import { FaStar } from "react-icons/fa";

const Featured = async () => {
    const facilities = await getFacilities();
    
    // ✅ Check your custom Express JWT "token" cookie directly from the browser context
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const isLoggedIn = !!token;

    return (
        <div className="py-16 md:py-24 bg-[#031637]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Featured Facilities
                        </h1>
                        <p className="text-white/70 mt-2 text-lg">
                            {facilities.length} premium sports venues available
                        </p>
                    </div>
                    <a 
                        href="/all-facilities" 
                        className="mt-4 md:mt-0 text-[#00D4FF] hover:text-white font-medium flex items-center gap-2 group"
                    >
                        View All Facilities 
                        <span className="group-hover:translate-x-1 transition">→</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {facilities.map((facility) => {
                        const facilityId = facility._id || facility.id;
                        const targetFacilityPath = `/facility/${facilityId}`;
                        
                        const bookingUrl = isLoggedIn 
                            ? targetFacilityPath 
                            : `/login?callbackUrl=${encodeURIComponent(targetFacilityPath)}`;

                        return (
                            <div
                                key={facilityId}
                                className="bg-[#031637] rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-[#00D4FF]/10 transition-all duration-300 border border-white/5 hover:border-[#00D4FF]/30"
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

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white line-clamp-2">
                                        {facility.name}
                                    </h3>
                                    
                                    <p className="text-white/60 text-sm mt-1">
                                        {facility.location}
                                    </p>

                                    {/* Rating & Price */}
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-[#00D4FF]" />
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

                                    <a 
                                        href={bookingUrl}
                                        className="mt-6 block w-full bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold py-3.5 rounded-2xl text-center transition-all duration-200 hover:scale-[1.02]"
                                    >
                                        Book Now
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Featured;