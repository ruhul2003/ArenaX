'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CalendarCheck, X, Calendar, Clock, DollarSign } from 'lucide-react';

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

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!bookingDate || !timeSlot || hours <= 0) {
            alert('Please fill out all required fields before completing your reservation.');
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
                totalBill: totalBill
            };

            console.log("Sending verified payload structure to backend:", payload);

            const response = await fetch(`${serverUrl}/api/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                credentials: 'include', 
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid format returned from application backend server router.");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong processing your booking request.');
            }

            alert('🎉 Reservation completed successfully!');
            setIsOpen(false); 
            router.push('/my-bookings');
            router.refresh();

        } catch (err) {
            console.error("Booking submission error:", err);
            alert(err.message);
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
                <CalendarCheck size={18} />
                <span>Reserve This Venue Now</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
                    <div className="bg-[#0A1F3D] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-white animate-scaleUp">
                        
                        {/* Close Icon Button */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2 text-[#00D4FF]">
                            <CalendarCheck size={22} /> Venue Reservation Form
                        </h3>
                        <p className="text-sm text-white/60 mb-6">Specify your playing times below to check database availability.</p>

                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2 flex items-center gap-1">
                                    <Calendar size={12} /> Select Date
                                </label>
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]} // Block historical past selections
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2 flex items-center gap-1">
                                    <Clock size={12} /> Desired Time Slot
                                </label>
                                <select
                                    required
                                    value={timeSlot}
                                    onChange={(e) => setTimeSlot(e.target.value)}
                                    className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition appearance-none"
                                >
                                    <option value="" disabled hidden>Choose an active slot...</option>
                                    {availableSlots.map((slot, index) => (
                                        <option key={index} value={slot} className="bg-[#0A1F3D]">{slot}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-white/40 font-semibold mb-2 flex items-center gap-1">
                                    Duration (Hours)
                                </label>
                                <input 
                                    type="number" 
                                    required
                                    min="1"
                                    max="12"
                                    value={hours}
                                    onChange={(e) => setHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                    className="w-full bg-[#031637] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] transition"
                                />
                            </div>

                            <div className="bg-[#031637] border border-white/5 rounded-2xl p-4 flex items-center justify-between mt-2">
                                <span className="text-sm text-white/60">Calculated Booking Cost:</span>
                                <span className="text-lg font-bold text-[#00D4FF] flex items-center gap-0.5">
                                    ৳ {totalBill}
                                </span>
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
                                    className="flex-1 bg-[#00D4FF] hover:bg-[#00b2d6] text-[#031637] font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isBooking ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Logging...
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