'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from "react-icons/fc"; // ➕ Imported matching registration views

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        setError('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${serverUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                credentials: 'include', 
                body: JSON.stringify({ 
                    email: formData.email,
                    password: formData.password 
                }), 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            if (data.success) {
                window.location.href = '/all-facilities';
            }

        } catch (err) {
            console.error("Login client error:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    // ➕ New Direct Redirect Authentication trigger handler
    const handleGoogleSignIn = () => {
        window.location.href = `${serverUrl}/api/auth/google`;
    };

    return (
        <div className="min-h-screen bg-[#031637] flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
                {/* Logo & Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Arena<span className="text-[#00D4FF]">X</span>
                    </h1>
                    <p className="text-white/70 mt-2 text-lg">Welcome back</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Email Address
                            </label>
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

                        {/* Password Field */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Password
                            </label>
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
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition disabled:opacity-30"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message Module */}
                        {error && (
                            <p className="text-red-400 text-sm text-center bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20 animate-in fade-in duration-200">
                                {error}
                            </p>
                        )}

                        {/* Submit Action */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-50 text-[#031637] font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 shadow-lg shadow-[#00D4FF]/10 flex items-center justify-center"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* ➕ Added Divider Layout element line */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-white/50 text-sm font-medium">OR</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    {/* ➕ Added Google Authentication Trigger Button element */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-70 text-black font-medium py-4 rounded-2xl transition-all"
                    >
                        <FcGoogle size={24} />
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center text-white/50 text-sm mt-8">
                    Do not have an account?{' '}
                    <a href="/signup" className="text-[#00D4FF] hover:underline font-medium transition-colors">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;