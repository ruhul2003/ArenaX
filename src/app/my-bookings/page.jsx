'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Loader2, ShieldCheck, CreditCard, Tag, MapPin, XCircle, AlertTriangle } from 'lucide-react';

export default function MyBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null); // Tracks which booking is processing cancellation
    const [confirmCancelId, setConfirmCancelId] = useState(null); // Tracks the "Are you sure?" confirmation state
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    const fetchMyBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetch(`${serverUrl}/api/my-bookings`, {
                method: 'GET',
                credentials: 'include', 
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 401) {
                router.push('/login');
                return;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid response from server. Please verify your API endpoint configuration.");
            }
            
            const data = await response.json();
            setBookings(data.data || data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            setCancellingId(bookingId);
            setError(null);

            const response = await fetch(`${serverUrl}/api/bookings/${bookingId}/cancel`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel the reservation.');
            }

            // Real-time local state update: change status to CANCELLED locally
            setBookings(prevBookings => 
                prevBookings.map(b => b._id === bookingId ? { ...b, status: 'CANCELLED' } : b)
            );
            
            // Clear out confirmation state
            setConfirmCancelId(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setCancellingId(null);
        }
    };

    useEffect(() => { 
        fetchMyBookings(); 
    }, []);

    const getStatusTheme = (status) => {
        const s = status?.toLowerCase();
        if (s === 'confirmed' || s === 'approved' || s === 'paid') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        if (s === 'cancelled' || s === 'failed') return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[#031637] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#031637] text-slate-200 py-16 px-6">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => router.push('/all-facilities')} 
                    className="group flex items-center gap-2 text-sm text-slate-400 hover:text-[#00D4FF] transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> Explore More Venues
                </button>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Reservation Dashboard</h1>
                        <p className="text-white/60 mt-1">Review, track, and verify your booked sporting sessions.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#0A1F3D] px-4 py-2 rounded-xl border border-white/5 text-sm self-start">
                        <ShieldCheck className="text-[#00D4FF]" size={18} />
                        <span className="text-white/80 font-medium">Verified Bookings Only</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="border border-white/10 rounded-3xl p-16 text-center bg-[#0A1F3D]/40">
                        <p className="text-white/50 text-lg">No active reservations found.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((b) => {
                            const facilityName = b.name || b.facilityName || b.facilityDetails?.name || "Premium Arena";
                            const facilityImage = b.image || b.facilityImage || b.facilityDetails?.image || '/placeholder.jpg';
                            const facilityType = b.facility_type || b.facilityType || b.facilityDetails?.facility_type;
                            const location = b.location || b.facilityDetails?.location;
                            const pricePerHour = b.price_per_hour || b.facilityDetails?.price_per_hour;
                            const totalPrice = b.amountPaid || b.totalPrice || b.price || pricePerHour || "0";
                            const isCancelled = b.status?.toLowerCase() === 'cancelled';

                            return (
                                <div 
                                    key={b._id} 
                                    className={`bg-[#0A1F3D] border rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col md:flex-row shadow-xl relative ${
                                        isCancelled ? 'border-white/5 opacity-60' : 'border-white/5'
                                    }`}
                                >
                                    {/* Facility Visual Thumbnail */}
                                    <div className="relative w-full md:w-64 h-48 md:h-auto bg-[#031637] flex-shrink-0">
                                        <Image 
                                            src={facilityImage} 
                                            alt={facilityName} 
                                            fill 
                                            className="object-cover"
                                            sizes="(max-w-768px) 100vw, 256px"
                                        />
                                    </div>

                                    {/* Main Details Panel */}
                                    <div className="p-6 md:p-8 flex-grow flex flex-col justify-between gap-6">
                                        <div>
                                            <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white tracking-tight">{facilityName}</h3>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        {facilityType && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-[#00D4FF] bg-[#00D4FF]/10 px-2.5 py-0.5 rounded-full font-semibold border border-[#00D4FF]/20">
                                                                <Tag size={12} /> {facilityType}
                                                            </span>
                                                        )}
                                                        {location && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-white/50">
                                                                <MapPin size={12} /> {location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${getStatusTheme(b.status)}`}>
                                                    {b.status || 'PENDING'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-white/5 pt-5">
                                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                                    <Calendar size={16} className="text-[#00D4FF]" /> 
                                                    <span><strong className="text-white/40 font-normal">Date:</strong> {b.date}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                                    <Clock size={16} className="text-[#00D4FF]" /> 
                                                    <span><strong className="text-white/40 font-normal">Selected Slot:</strong> {b.slot || b.timeSlot}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/70 text-sm sm:col-span-2">
                                                    <CreditCard size={16} className="text-[#00D4FF]" /> 
                                                    <span><strong className="text-white/40 font-normal">Total Bill:</strong> ৳{totalPrice}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actionable Cancellation Row */}
                                        {!isCancelled && (
                                            <div className="flex items-center justify-end border-t border-white/5 pt-4">
                                                {confirmCancelId === b._id ? (
                                                    <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl animate-fade-in">
                                                        <span className="text-xs text-rose-300 px-2">Are you sure you want to cancel?</span>
                                                        <button
                                                            disabled={cancellingId === b._id}
                                                            onClick={() => handleCancelBooking(b._id)}
                                                            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                                                        >
                                                            {cancellingId === b._id ? (
                                                                <Loader2 size={12} className="animate-spin" />
                                                            ) : 'Yes, Cancel'}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmCancelId(null)}
                                                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmCancelId(b._id)}
                                                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 bg-white/[0.02] hover:bg-rose-500/5 px-4 py-2 rounded-xl transition-all duration-200"
                                                    >
                                                        <XCircle size={14} /> Cancel Booking
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}