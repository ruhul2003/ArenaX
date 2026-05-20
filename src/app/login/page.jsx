'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const router = useRouter();

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
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Success
            alert("Login successful! Welcome back.");
            router.push('/all-facilities');   // or '/' for home

        } catch (err) {
            console.error(err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        alert("Google Sign-In coming soon...");
        // We'll implement this later with Better Auth or Firebase
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
                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-xl">
                                {error}
                            </p>
                        )}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-70 text-[#031637] font-semibold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-white/50 text-sm font-medium">OR</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-medium py-4 rounded-2xl transition-all duration-200"
                    >
                        <Image 
                            src="https://www.google.com/favicon.ico" 
                            alt="Google" 
                            width={20}
                            height={20}
                        />
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center text-white/50 text-sm mt-8">
                    Don't have an account?{' '}
                    <a href="/register" className="text-[#00D4FF] hover:underline font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;