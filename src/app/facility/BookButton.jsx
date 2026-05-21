'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Clock, DollarSign, Dumbbell } from 'lucide-react';

const BookButton = ({ facility }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form States
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [hours, setHours] = useState(1);
    const [totalPrice, setTotalPrice] = useState(facility?.price_per_hour || 0);

    // Automatically recalculate total cost when hours or base facility pricing shifts
    useEffect(() => {
        const rate = facility?.price_per_hour || facility?.pricePerHour || 0;
        setTotalPrice(Number(hours) * Number(rate)); 
    }, [hours, facility]);

    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => {
        setIsOpen(false);
        setBookingDate('');
        setTimeSlot('');
        setHours(1);
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    facility_id: facility._id || facility.id,
                    facility_name: facility.name,
                    booking_date: bookingDate,
                    time_slot: timeSlot,
                    hours: hours,
                    total_price: totalPrice
                })
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("You must be logged in to make a reservation.");
                }
                throw new Error(result.error || "Failed to finalize booking reservation.");
            }

            alert(`Reservation successful! Your reservation for ${facility.name} is now pending approval.`);
            handleCloseModal();
            router.refresh();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Primary CTA Trigger Button */}
            <button 
                onClick={handleOpenModal}
                className="w-full bg-[#00D4FF] hover:bg-[#00E5FF] active:scale-[0.985] text-[#031637] font-semibold py-5 rounded-2xl text-xl transition-all duration-200 shadow-lg shadow-[#00D4FF]/30"
            >
                Book This Facility Now
            </button>

            {/* Modal Box Overlay Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#041c44] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative text-white">
                        
                        {/* Header Header Row */}
                        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2 text-[#00D4FF]">
                                <Dumbbell size={20} />
                                <h3 className="text-lg font-bold">Secure Reservation Form</h3>
                            </div>
                            <button onClick={handleCloseModal} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/5 transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Interactive Input Form */}
                        <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
                            {/* Read-Only: Facility Name */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Facility Name</label>
                                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-semibold text-white/90">
                                    {facility.name}
                                </div>
                            </div>

                            {/* Booking Date Selection */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Booking Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 text-white/40" size={18} />
                                    <input 
                                        type="date" 
                                        required
                                        value={bookingDate}
                                        min={new Date().toISOString().split('T')[0]} // Block choice of retro-active past dates
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                                    />
                                </div>
                            </div>

                            {/* Time Slot Input Selection */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Preferred Time Slot</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-3.5 text-white/40" size={18} />
                                    <select
                                        required
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        className="w-full bg-[#041c44] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled hidden>Select an hourly block</option>
                                        <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                                        <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                        <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                                        <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                        <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                        <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                                        <option value="08:00 PM - 10:00 PM">08:00 PM - 10:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            {/* Hours Multiplier Input Count */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Duration (Hours)</label>
                                <input 
                                    type="number" 
                                    required
                                    min="1"
                                    max="12"
                                    value={hours}
                                    onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                                />
                            </div>

                            {/* Output Block: Live Total Price Calculation */}
                            <div className="bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Total Est. Price</p>
                                    <p className="text-xs text-white/40 mt-0.5">(${facility.price_per_hour || 0}/hr base rate)</p>
                                </div>
                                <div className="flex items-center text-[#00D4FF] font-bold text-2xl">
                                    <DollarSign size={22} className="stroke-[2.5]" />
                                    <span>{totalPrice}</span>
                                </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal}
                                    className="w-1/3 py-3 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-2/3 bg-[#00D4FF] text-[#031637] py-3 rounded-xl text-sm font-bold hover:bg-[#00b2d6] transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Processing..." : "Confirm & Book"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookButton;