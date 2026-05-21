import React from 'react';
import { Clock, Shield, Award, Users } from 'lucide-react';

const WhyChooseUs = () => {
    const features = [
        {
            icon: <Clock className="w-10 h-10" />,
            title: "Instant Booking",
            description: "Book your favorite sports venue in just a few clicks with real-time availability.",
        },
        {
            icon: <Shield className="w-10 h-10" />,
            title: "Verified Venues",
            description: "All facilities are thoroughly verified and maintained for the best playing experience.",
        },
        {
            icon: <Award className="w-10 h-10" />,
            title: "Best Price Guarantee",
            description: "Get the lowest prices with transparent pricing and no hidden charges.",
        },
        {
            icon: <Users className="w-10 h-10" />,
            title: "24/7 Support",
            description: "Our dedicated team is always ready to assist you before, during, and after your booking.",
        },
    ];

    return (
        <div className="py-20 w-full mx-auto bg-[#031637]">
            <div className="max-w-9/12 mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Why Choose <span className="text-[#00D4FF]">ArenaX</span>
                    </h2>
                    <p className="text-white/70 mt-3 text-lg max-w-2xl mx-auto">
                        We make sports venue booking simple, reliable, and enjoyable
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#0A1F3D] border border-white/10 hover:border-[#00D4FF]/30 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 group"
                        >
                            <div className="text-[#00D4FF] mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            
                            <h3 className="text-2xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            
                            <p className="text-white/70 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;