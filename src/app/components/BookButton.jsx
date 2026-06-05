'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CalendarCheck, X, Calendar, Clock } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import Image from 'next/image';
import { toast } from 'react-hot-toast';    

export default function BookButton({ facilityId, hourlyRate, facilityName }) {
    const router = useRouter();
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    
    const [isOpen, setIsOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [hours, setHours] = useState(1);

    const availableSlots = [
        "08:00 AM - 10:00 AM",
        "10:00 AM - 12:00 PM",
        "12:00 PM - 02:00 PM",
        "02:00 PM - 04:00 PM",
        "04:00 PM - 06:00 PM",
        "06:00 PM - 08:00 PM",
        "08:00 PM - 10:00 PM"
    ];

    const rate = Number(hourlyRate) || 0;
    const totalBill = rate * Number(hours);

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.email) {
            toast.error("You must be logged in to make a reservation.", {
                position: 'top-right',
            });
            return;
        }

        if (!bookingDate || !timeSlot || hours <= 0) {
            toast.error("Please fill out all required fields.", {
                position: 'top-right',
            });
            return;
        }

        setIsBooking(true);

        try {
            const payload = {
                facilityId: facilityId,
                facility_name: facilityName,
                date: bookingDate,      
                slot: timeSlot,        
                hours: Number(hours),
                totalBill: totalBill,
                email: user.email
            };

            const response = await fetch(`${serverUrl}/api/booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Booking failed. Please try again.');
            }

            toast.success("Reservation completed successfully!", {
                duration: 5000,
                position: 'top-right',
            });

            setIsOpen(false);
            router.push('/my-bookings');
            router.refresh();

        } catch (err) {
            console.error("Booking error:", err);
            toast.error(err.message || "Something went wrong. Please try again.", {
                position: 'top-right',
            });
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-[#00D4FF] hover:bg-[#00b2d6] text-[#031637] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg active:scale-[0.98]"
            >
                <CalendarCheck className="w-5 h-5" />
                Reserve This Venue Now
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#020c24] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                            Venue Reservation Form
                        </h2>
                        <p className="text-xs text-white/60 mb-6">
                            Specify your playing times below to check database availability.
                        </p>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#00D4FF]" /> Select Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#00D4FF]" /> Desired Time Slot
                                </label>
                                <select
                                    required
                                    value={timeSlot}
                                    onChange={(e) => setTimeSlot(e.target.value)}
                                    className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition appearance-none"
                                >
                                    <option value="" disabled hidden>Choose an active slot...</option>
                                    {availableSlots.map((slot, index) => (
                                        <option key={index} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#00D4FF]" /> Duration (Hours)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={hours}
                                    onChange={(e) => setHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                    className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition"
                                />
                            </div>

                            <div className="bg-[#031637]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                <span className="text-sm text-white/70 font-medium">Calculated Booking Cost:</span>
                                <div className="text-xl font-bold text-[#00D4FF] flex items-center gap-0.5">
                                    ৳ {totalBill}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 rounded-xl transition text-sm"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBooking}
                                    className="flex-1 bg-[#00D4FF] hover:bg-[#00b2d6] text-[#031637] font-bold py-3.5 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isBooking ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm & Pay"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}