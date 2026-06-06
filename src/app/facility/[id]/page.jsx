import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Users, Star, ShieldCheck } from 'lucide-react';
import BookButton from '../../components/BookButton';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const FacilityDetails = async ({ params }) => {
    const { id } = await params;

    const { token } = await auth.api.getToken({
        headers: await headers()
    });


    let facility = null;
    let error = null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/facility/${id}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
            cache: 'no-store', 
        });

        if (!res.ok) {
            throw new Error("Venue configurations are currently unavailable.");
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("The requested facility page doesn't exist or returned an unexpected server format.");
        }

        facility = await res.json();
    } catch (err) {
        console.error("Facility fetch failed:", err);
        error = err.message || "Failed to retrieve listing metrics.";
    }

    if (error || !facility) {
        return (
            <div className="min-h-screen bg-[#031637] flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="text-red-500 mb-4 text-7xl">⚠️</div>
                <h2 className="text-4xl font-bold mb-2">Venue Not Found</h2>
                <p className="text-white/60 mb-6 max-w-md">{error}</p>
                <Link 
                    href="/all-facilities" 
                    className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium px-6 py-3 rounded-xl transition duration-200"
                >
                    ← Return to Browse
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <Link 
                    href="/all-facilities" 
                    className="flex items-center gap-2 text-white/60 hover:text-[#00D4FF] transition mb-8 group w-fit"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                    Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                   
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl border border-white/5 bg-[#0A1F3D]">
                            <Image 
                                src={facility.image || '/placeholder.jpg'} 
                                alt={facility.name} 
                                fill 
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                                sizes="(max-width: 768px) 100vw, 700px"
                            />
                        </div>

                        <div className="bg-[#0A1F3D] p-8 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-semibold mb-4">About the Venue</h2>
                            <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line">
                                {facility.description}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#0A1F3D] p-8 rounded-3xl border border-white/10 shadow-xl">
                            <h1 className="text-4xl font-bold mb-2 tracking-tight">{facility.name}</h1>
                            
                            <div className="flex items-center gap-2 text-[#00D4FF] mb-6">
                                <MapPin size={18} /> 
                                <span className="font-medium">{facility.location}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#031637] p-4 rounded-xl text-center border border-white/5">
                                    <Users className="mx-auto mb-2 text-[#00D4FF]" size={24} />
                                    <p className="text-sm text-white/50">Capacity</p>
                                    <p className="font-bold text-lg">{facility.capacity || 20} Players</p>
                                </div>
                                <div className="bg-[#031637] p-4 rounded-xl text-center border border-white/5">
                                    <Star className="mx-auto mb-2 text-yellow-400 fill-yellow-400" size={24} />
                                    <p className="text-sm text-white/50">Rating</p>
                                    <p className="font-bold text-lg">4.8 / 5.0</p>
                                </div>
                            </div>

                            <div className="mb-8 bg-[#031637]/50 p-4 rounded-2xl border border-white/5">
                                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">Hourly Rate</p>
                                <p className="text-5xl font-extrabold text-[#00D4FF]">
                                    ৳{facility.price_per_hour}
                                    <span className="text-sm text-white/40 font-normal tracking-normal ml-2">/ hour</span>
                                </p>
                            </div>

                            <BookButton 
                                facilityId={facility._id} 
                                facilityName={facility.name} 
                                hourlyRate={facility.price_per_hour} 
                            />
                        </div>

                        <div className="bg-[#0A1F3D] p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                            <ShieldCheck className="text-green-400 mt-1 shrink-0" size={24} />
                            <div>
                                <h4 className="font-semibold text-white">ArenaX Guard Protection</h4>
                                <p className="text-sm text-white/60 leading-relaxed mt-0.5">
                                    Verified commercial listing. Payment funds are escrowed safely until match slot verification checks pass.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;