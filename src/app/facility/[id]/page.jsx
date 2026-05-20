import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Clock, Users } from 'lucide-react';
import BookButton from '../BookButton';

const FacilityDetails = async ({ params }) => {
    // ✅ Important: Await params in Next.js 15+
    const { id } = await params;

    console.log("✅ ID from URL:", id);

    let facility = null;
    let error = null;

    try {
        const res = await fetch('http://localhost:5000/facilities', {
            cache: 'no-store',
            next: { revalidate: 0 },
        });

        const facilities = await res.json();

        facility = facilities.find(f => {
            const dbId = f._id?.toString() || f.id?.toString();
            return dbId === id;
        });
    } catch (err) {
        console.error("Error fetching facility:", err);
        error = "Failed to load facility details.";
    }

    if (error || !facility) {
        return (
            <div className="min-h-screen bg-[#031637] flex flex-col items-center justify-center text-white px-6 py-20">
                <h1 className="text-5xl font-bold mb-4">Facility Not Found</h1>
                <p className="text-red-400 mb-8 text-center max-w-md">
                    No facility found with ID: <span className="font-mono">{id || 'undefined'}</span>
                </p>
                <Link 
                    href="/all-facilities"
                    className="bg-[#00D4FF] text-[#031637] px-8 py-4 rounded-2xl font-semibold hover:bg-[#00B8E0] transition-all flex items-center gap-2"
                >
                    ← Back to All Facilities
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <Link 
                    href="/all-facilities" 
                    className="inline-flex items-center gap-2 text-[#00D4FF] hover:text-[#00E5FF] transition-colors mb-10 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to All Facilities
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
                    {/* Image Section */}
                    <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-square shadow-2xl">
                        <Image
                            src={facility.image || '/placeholder.jpg'}
                            alt={facility.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute top-6 text-gray-500 right-6 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            {facility.facility_type || 'Sports Venue'}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                {facility.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-4 text-white/70">
                                <MapPin className="w-5 h-5 text-[#00D4FF]" />
                                <p className="text-xl">{facility.location}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-lg">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold text-white">4.8</span>
                                <span className="text-white/60">(124 reviews)</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/80">
                                <Clock className="w-5 h-5" />
                                <span>Open till 11:00 PM</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/80">
                                <Users className="w-5 h-5" />
                                <span>Max {facility.capacity || '20'} people</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-white">About this venue</h3>
                            <p className="text-white/80 leading-relaxed text-[17px]">
                                {facility.description || "No description available."}
                            </p>
                        </div>

                        <div className="bg-[#0A1F3D] rounded-3xl p-8 border border-white/5">
                            <p className="text-white/60 text-sm uppercase tracking-widest">Hourly Rate</p>
                            <p className="text-6xl font-bold text-[#00D4FF] mt-3">
                                ৳{facility.price_per_hour}
                                <span className="text-2xl text-white/60 font-normal">/hour</span>
                            </p>
                        </div>

                        <BookButton facility={facility} />
                    </div>
                </div>

                {/* Bottom Sections */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#0A1F3D] rounded-3xl p-8">
                        <h4 className="font-semibold text-lg mb-6 text-white">Amenities</h4>
                        <ul className="space-y-3 text-white/80">
                            {['Changing Rooms', 'Parking', 'WiFi', 'Drinking Water', 'First Aid'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#00D4FF] rounded-full" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#0A1F3D] rounded-3xl p-8">
                        <h4 className="font-semibold text-lg mb-6 text-white">Rules</h4>
                        <ul className="space-y-3 text-white/80 text-sm">
                            <li>• Proper sports attire required</li>
                            <li>• No outside food or drinks</li>
                            <li>• 30 minutes grace period for booking</li>
                            <li>• Cancellation 24hrs before</li>
                        </ul>
                    </div>

                    <div className="bg-[#0A1F3D] rounded-3xl p-8">
                        <h4 className="font-semibold text-lg mb-6 text-white">Location</h4>
                        <p className="text-white/70">{facility.location}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;