'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MoveLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#031637] text-white flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full text-center relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 text-[#00D4FF] mb-6 animate-bounce">
                    <HelpCircle size={40} />
                </div>

                <h1 className="text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D4FF] to-blue-500 mb-2">
                    404
                </h1>
                <h2 className="text-2xl font-bold tracking-tight mb-3">
                    Out of Bounds!
                </h2>
                <p className="text-white/60 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                    The page or arena you are looking for does not exist, has been rearranged, or is currently closed for maintenance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-white text-sm font-medium px-5 py-3 rounded-xl transition duration-200"
                    >
                        <MoveLeft size={16} />
                        Go Back
                    </button>
                    
                    <button
                        onClick={() => router.push('/')}
                        className="w-full sm:w-auto bg-[#00D4FF] text-[#031637] hover:bg-[#00b2d6] text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-[#00D4FF]/10 transition duration-200"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
}