'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Users, ShieldCheck, Loader2 } from 'lucide-react';
import BookButton from '../BookButton';

const FacilityDetails = () => {
    const { id } = useParams();
    const [facility, setFacility] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchFacility = async () => {
            try {
                // ✅ FIXED: Changed endpoint path from /api/facilities/ to /api/facility/ to fix the 404 error
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/facility/${id}`);
                if (!res.ok) throw new Error("Venue unavailable.");
                setFacility(await res.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFacility();
    }, [id]);

    if (isLoading) return <div className="min-h-screen bg-[#031637] flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin" /></div>;

    if (error || !facility) return (
        <div className="min-h-screen bg-[#031637] flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Venue Not Found</h2>
            <Link href="/all-facilities" className="text-[#00D4FF] hover:underline">← Return to Browse</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#031637] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <Link href="/all-facilities" className="flex items-center gap-2 text-white/60 hover:text-[#00D4FF] transition mb-8">
                    <ArrowLeft size={20} /> Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Media & Description */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl border border-white/5">
                            <Image src={facility.image || '/placeholder.jpg'} alt={facility.name} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        
                        <div className="bg-[#0A1F3D] p-8 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-semibold mb-4">About the Venue</h2>
                            <p className="text-white/70 leading-relaxed text-lg">{facility.description}</p>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Quick Stats */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#0A1F3D] p-8 rounded-3xl border border-white/10 shadow-xl">
                            <h1 className="text-4xl font-bold mb-2">{facility.name}</h1>
                            <div className="flex items-center gap-2 text-[#00D4FF] mb-6">
                                <MapPin size={18} /> {facility.location}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#031637] p-4 rounded-xl text-center">
                                    <Users className="mx-auto mb-2 text-[#00D4FF]" />
                                    <p className="text-sm text-white/50">Capacity</p>
                                    <p className="font-bold">{facility.capacity || 20}+</p>
                                </div>
                                <div className="bg-[#031637] p-4 rounded-xl text-center">
                                    <Star className="mx-auto mb-2 text-yellow-400" />
                                    <p className="text-sm text-white/50">Rating</p>
                                    <p className="font-bold">4.8/5.0</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-white/50 text-sm uppercase tracking-widest">Hourly Rate</p>
                                <p className="text-5xl font-bold text-[#00D4FF]">৳{facility.price_per_hour}</p>
                            </div>

                            <BookButton facility={facility} />
                        </div>

                        <div className="bg-[#0A1F3D] p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                            <ShieldCheck className="text-green-400 mt-1" />
                            <div>
                                <h4 className="font-semibold">Secure Booking</h4>
                                <p className="text-sm text-white/60">Verified facility with secure payment processing.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;