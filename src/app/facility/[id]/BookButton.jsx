'use client';

import React from 'react';

const BookButton = ({ facility }) => {
    const handleBooking = () => {
        alert(`Booking flow for ${facility.name} is coming soon!`);
        // Future: Open modal, redirect to booking page, etc.
    };

    return (
        <button 
            onClick={handleBooking}
            className="w-full bg-[#00D4FF] hover:bg-[#00E5FF] active:scale-[0.985] text-[#031637] font-semibold py-5 rounded-2xl text-xl transition-all duration-200 shadow-lg shadow-[#00D4FF]/30"
        >
            Book This Facility Now
        </button>
    );
};

export default BookButton;