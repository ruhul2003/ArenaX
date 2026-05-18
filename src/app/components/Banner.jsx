import React from 'react';
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";

const Banner = () => {
    return (
        <div className="relative min-h-[90vh] flex items-center bg-[url('/images/hero2.jpg')] bg-cover bg-center overflow-hidden">

            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622473596135-2e2c2e2e2e2e')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#031637]/95 via-[#031637]/90 to-[#031637]/80"></div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-24">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight tracking-tighter">
                        Every Match Deserves <br />
                        <span className="text-[#00D4FF]">The Perfect Field.</span>
                    </h1>

                    <p className="mt-6 text-center text-sm md:text-xl md:leading-relaxed lg:text-[1.1rem] text-white/80 leading-relaxed max-w-4xl">
                        Find and book top-quality sports fields in just a few clicks. Whether it’s football, cricket, badminton, or futsal — discover the perfect venue, choose your preferred time, and get ready to play.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <button className="bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-105 active:scale-95">
                            Explore Facilities
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-white">
                        {/* Rating */}
                        <div className="flex flex-row items-center gap-3">
                            <div className="flex gap-1 text-[#00D4FF] text-2xl">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStarHalf />
                            </div>
                            <div className="flex flex-row gap-1 md:gap-2 lg:gap-4 items-center">
                                <div className="font-semibold text-[#00D4FF] text-5xl leading-none">4.9</div>
                                <div className="text-sm text-white/70 -mt-0.5">Average Rating</div>
                            </div>
                        </div>

                        {/* First Divider */}
                        <div className="w-full h-px md:w-px md:h-12 bg-white/10 self-stretch md:self-auto shrink-0"></div>

                        {/* Venues */}
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-[#00D4FF]">500+</div>
                            <div className="text-sm leading-tight">
                                Premium<br />
                                <span className="text-white/70">Venues</span>
                            </div>
                        </div>

                        {/* Second Divider  */}
                        <div className="w-full h-px md:w-px md:h-12 bg-white/10 self-stretch md:self-auto shrink-0"></div>

                        {/* Bookings */}
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-[#00D4FF]">10K+</div>
                            <div className="text-sm leading-tight">
                                Successful<br />
                                <span className="text-white/70">Bookings</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#031637] to-transparent"></div>
        </div>
    );
};

export default Banner;