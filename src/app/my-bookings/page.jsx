'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, Dumbbell, ArrowLeft, XCircle } from 'lucide-react';

export default function MyBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
 
    const fetchMyBookings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/my-bookings');
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Please log in to review your reservations.");
                }
                throw new Error("Failed to load booking history.");
            }

            const result = await response.json();
            setBookings(result.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`/api/my-bookings?id=${bookingId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to cancel booking.");
            }

            alert("Your booking has been cancelled successfully.");
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
            case 'cancelled':
                return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
            case 'pending':
            default:
                return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white/60 text-sm animate-pulse">Loading your reservations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/20 max-w-md w-full p-6 rounded-2xl text-center">
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                    <button onClick={() => router.push('/')} className="bg-[#00D4FF] text-[#031637] px-5 py-2 rounded-xl font-semibold hover:bg-[#00b2d6] transition">
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031637] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => router.push('/')} 
                    className="inline-flex items-center gap-2 text-white/60 hover:text-[#00D4FF] text-sm font-medium mb-6 transition"
                >
                    <ArrowLeft size={16} />
                    Back to Explore Arenas
                </button>

                <div className="border-b border-white/10 pb-5 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Booking History</h1>
                    <p className="text-white/50 text-sm mt-1">Track updates, confirmation receipts, and status listings for your venue appointments.</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto mt-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4">
                            <Dumbbell size={24} />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No Bookings Found</h3>
                        <p className="text-white/50 text-sm mb-6">You do not have any facility appointments recorded at this moment.</p>
                        <button onClick={() => router.push('/')} className="bg-[#00D4FF] text-[#031637] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#00b2d6] transition">
                            Find an Arena to Book
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div 
                                key={booking._id} 
                                className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-white/20"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-lg font-bold text-white tracking-tight">{booking.facility_name}</h3>
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${getStatusStyles(booking.status)}`}>
                                            {booking.status || 'pending'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-white/60 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={15} className="text-[#00D4FF]" />
                                            <span>{booking.booking_date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={15} className="text-[#00D4FF]" />
                                            <span>{booking.time_slot} ({booking.hours} {booking.hours === 1 ? 'hr' : 'hrs'})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 border-t border-white/5 md:border-none pt-3 md:pt-0">
                                    <div className="flex items-center text-[#00D4FF] font-bold text-xl md:text-2xl">
                                        <DollarSign size={18} className="stroke-[2.5]" />
                                        <span>{booking.total_price}</span>
                                    </div>

                                    {booking.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition"
                                            title="Cancel Reservation"
                                        >
                                            <XCircle size={14} />
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}