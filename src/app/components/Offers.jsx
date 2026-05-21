import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const Offers = () => {
    const offers = [
        {
            id: 1,
            title: "Weekend Warrior Deal",
            subtitle: "Get 30% OFF",
            description: "Book any football or cricket ground this weekend",
            discount: "30%",
            validity: "Valid till 25 May 2026",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
            color: "from-orange-500 to-red-500",
        },
        {
            id: 2,
            title: "Early Bird Offer",
            subtitle: "Flat 25% OFF",
            description: "Book before 10 AM and enjoy huge savings",
            discount: "25%",
            validity: "Daily Offer",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
            color: "from-[#00D4FF] to-cyan-400",
        },
        {
            id: 3,
            title: "First Booking Bonus",
            subtitle: "Up to 40% OFF",
            description: "New users get massive discount on first booking",
            discount: "40%",
            validity: "For new users only",
            image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d",
            color: "from-purple-500 to-violet-500",
        },
    ];

    return (
        <div className="py-20 bg-[#0A1F3D]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Special <span className="text-[#00D4FF]">Offers</span>
                    </h2>
                    <p className="text-white/70 mt-3 text-lg">
                        Grab these limited time deals and play more for less
                    </p>
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="group bg-[#031637] flex flex-col justify-between rounded-3xl overflow-hidden border border-white/10 hover:border-[#00D4FF]/40 transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Image Section */}
                            <div className="relative h-56">
                                <Image
                                    src={offer.image}
                                    alt={offer.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-5 right-5 bg-black/80 text-white text-sm font-bold px-4 py-1.5 rounded-2xl">
                                    {offer.discount} OFF
                                </div>
                                <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-40`}></div>
                            </div>

                            {/* Content */}
                            <div className="p-7">
                                <h3 className="text-2xl font-semibold text-white">
                                    {offer.title}
                                </h3>
                                <p className="text-[#00D4FF] font-medium mt-1">{offer.subtitle}</p>

                                <p className="text-white/70 mt-4 leading-relaxed">
                                    {offer.description}
                                </p>

                                <div className="flex items-center gap-2 mt-6 text-sm text-white/60">
                                    <Clock size={18} />
                                    <span>{offer.validity}</span>
                                </div>

                                <button className="mt-8 w-full bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95">
                                    Claim This Offer
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-white/50 text-sm mt-10">
                    *Terms and conditions apply. Offers are subject to availability.
                </p>
            </div>
        </div>
    );
};

export default Offers;