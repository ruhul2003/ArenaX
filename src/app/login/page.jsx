'use client';

import { authClient } from '../../lib/auth-client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Better Auth Login
            const { error: authError } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw new Error(authError.message || "Invalid credentials");

            // 2. Set backend cookie
            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
            
            await fetch(`${serverUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
                credentials: 'include',
            });

            // 3. Redirect
            router.push('/all-facilities');
            router.refresh();

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/all-facilities'
            });
        } catch (err) {
            setError("Google sign-in failed.");
        } finally {
            setLoading(false);
        }
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

                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
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

                        {error && (
                            <p className="text-red-500 text-sm text-center bg-red-500/10 py-3 rounded-xl">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-70 text-[#031637] font-semibold py-4 rounded-2xl text-lg transition-all"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-white/50 text-sm">OR</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-medium py-4 rounded-2xl transition-all"
                    >
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center text-white/50 text-sm mt-8">
                    Do not have an account?{' '}
                    <a href="/signup" className="text-[#00D4FF] hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;