'use client';

import React, { useState, Suspense } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/all-facilities';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setLoading(true);

        console.log("Mocking login client behavior with payload data:", formData);
        console.log("Redirecting user directly to:", redirect);
        
        // Simulating immediate client transition without handling cookies or tokens
        window.location.href = redirect;
    };

    return (
        <div className="min-h-screen bg-[#031637] flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Arena<span className="text-[#00D4FF]">X</span>
                    </h1>
                    <p className="text-white/70 mt-2 text-lg">Welcome back</p>
                </div>

                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                disabled={loading}
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition disabled:opacity-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    disabled={loading}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition pr-14 disabled:opacity-50"
                                    required
                                />
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-50 text-[#031637] font-bold py-4 rounded-2xl text-lg transition-all"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/50 text-sm mt-8">
                    Do not have an account?{' '}
                    <a href="/signup" className="text-[#00D4FF] hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#031637] flex items-center justify-center text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}