import React from 'react';
import { getFacilities } from '../lib/data';

const Featured = async () => {
    const facilities = await getFacilities();

    return (
        <div className="py-16 bg-[#0A1F3D]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
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

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {facilities.map((facility) => (
                        <div
                            key={facility.id}
                            className="bg-[#031637] rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-[#00D4FF]/10 transition-all duration-300 border border-white/5 hover:border-[#00D4FF]/30"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={facility.image || '/placeholder.jpg'}
                                    alt={facility.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-full">
                                    {facility.sportType || 'Multi-Sport'}
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
                                        <span className="text-[#00D4FF]">★</span>
                                        <span className="text-white font-medium">{facility.rating}</span>
                                        <span className="text-white/50 text-sm">({facility.reviews || 0})</span>
                                    </div>

                                    <div>
                                        <span className="text-[#00D4FF] font-bold text-xl">৳{facility.price}</span>
                                        <span className="text-white/50 text-sm">/hr</span>
                                    </div>
                                </div>

                                {/* Book Button */}
                                <button className="mt-6 w-full bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Featured;