'use client';

import React, { useState, Suspense } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Separator } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const redirectPath = searchParams.get('redirect') || '/';

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries());

        const { data, error: authError } = await authClient.signIn.email({
            email: user.email,
            password: user.password,
        });

        setLoading(false);

        if (data) {
            router.push(redirectPath);
            router.refresh();
        }


        if (authError) {
            setError(authError.message || "Invalid email or password");
        }
    };

    const handleGoogleSignin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
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

                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6">
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Email Address */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition pr-14"
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
                            <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20 px-4">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-70 text-[#031637] font-bold py-4 rounded-2xl text-lg transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider / Separator */}
                    <div className="flex justify-center items-center gap-3 opacity-70">
                        <Separator className="bg-white/10 flex-1" />
                        <div className="whitespace-nowrap text-white/60 text-sm">
                            Or sign in with
                        </div>
                        <Separator className="bg-white/10 flex-1" />
                    </div>

                    {/* Google Login Button */}
                    <div>
                        <button
                            onClick={handleGoogleSignin}
                            type="button"
                            className="w-full bg-transparent hover:bg-white/5 text-white border border-white/10 font-semibold py-4 rounded-2xl text-lg transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <FcGoogle size={24} /> Sign in with Google
                        </button>
                    </div>
                </div>

                <p className="text-center text-white/50 text-sm mt-8">
                    Do not have an account?{' '}
                    <Link href="/signup" className="text-[#00D4FF] hover:underline font-medium">
                        Sign up
                    </Link>
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