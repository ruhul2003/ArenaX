import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FacilityDetails = async ({ params }) => {
    const { id } = params;

    let facility = null;

    try {
        // Fetch from the same backend as All Facilities page
        const res = await fetch('http://localhost:5000/facilities', {
            cache: 'no-store'
        });
        const facilities = await res.json();

        // Find facility by id (numeric) or _id
        facility = facilities.find(f => 
            f.id?.toString() === id || 
            f._id?.toString() === id
        );
    } catch (error) {
        console.error("Error fetching facility:", error);
    }

    if (!facility) {
        return (
            <div className="min-h-screen bg-[#031637] flex flex-col items-center justify-center text-white px-6 py-20">
                <h1 className="text-5xl font-bold mb-6">Facility Not Found</h1>
                <p className="text-red-400 mb-2">Requested ID: <span className="font-mono">{id}</span></p>
                
                <Link 
                    href="/all-facilities"
                    className="mt-10 bg-[#00D4FF] text-[#031637] px-10 py-4 rounded-2xl font-semibold hover:bg-[#00B8E0] text-lg"
                >
                    ← Back to All Facilities
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] pb-16">
            <div className="max-w-6xl mx-auto px-6 pt-8">
                <Link 
                    href="/all-facilities" 
                    className="text-[#00D4FF] hover:underline flex items-center gap-2 mb-8 inline-block text-lg"
                >
                    ← Back to All Facilities
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-square">
                        <Image
                            src={facility.image || '/placeholder.jpg'}
                            alt={facility.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Details */}
                    <div className="text-white space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                {facility.name}
                            </h1>
                            <p className="text-[#00D4FF] text-xl mt-3">{facility.location}</p>
                        </div>

                        <div className="flex items-center gap-8 text-lg">
                            <div>★ <span className="font-semibold">4.8</span></div>
                            <div>{facility.facility_type || 'Sports Facility'}</div>
                        </div>

                        <p className="text-white/80 text-lg leading-relaxed">
                            {facility.description}
                        </p>

                        <div className="bg-[#0A1F3D] rounded-3xl p-8">
                            <p className="text-white/60">Hourly Rate</p>
                            <p className="text-6xl font-bold text-[#00D4FF] mt-2">
                                ৳{facility.price_per_hour}
                                <span className="text-2xl text-white/70">/hr</span>
                            </p>
                        </div>

                        <button className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold py-5 rounded-2xl text-xl transition-all hover:scale-[1.02]">
                            Book This Facility
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;