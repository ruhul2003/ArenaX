'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { authClient } from '../../lib/auth-client'; 
import { useRouter } from 'next/navigation';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        image: ''
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

        const password = formData.password;
        const hasMinLength = password.length >= 6;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);

        if (!hasMinLength || !hasUppercase || !hasLowercase) {
            setError(
                "Password must be at least 6 characters long and contain both uppercase and lowercase letters."
            );
            setLoading(false);
            return;
        }

        try {
            const signupPayload = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
            };

            if (formData.image && formData.image.trim() !== "") {
                signupPayload.image = formData.image;
            }

            const { data, error: authError } = await authClient.signUp.email(signupPayload);

            if (authError) {
                throw new Error(authError.message || "Registration failed");
            }

            alert("✅ Account created successfully!");
            router.push('/login');
            
        } catch (err) {
            console.error("Signup Client Error:", err);
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError('');
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/' // Standardized route redirect target matching your login landing page structure
            });
        } catch (err) {
            console.error("Google signup exception:", err);
            setError("Google signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#031637] flex items-center justify-center px-6 py-12">
            {/* ✅ Standardized container width matching layout rules cleanly */}
            <div className="max-w-xl w-full">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Arena<span className="text-[#00D4FF]">X</span>
                    </h1>
                    <p className="text-white/70 mt-2 text-lg">Create your account</p>
                </div>

                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
                                    required
                                />
                            </div>

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
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
                                    required
                                />
                            </div>

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
                                        placeholder="Create password"
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

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Profile Picture URL <span className="text-white/50 text-xs">(Optional)</span>
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-70 text-[#031637] font-semibold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-white/50 text-sm font-medium">OR</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <button
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-70 text-black font-medium py-4 rounded-2xl transition-all"
                    >
                        <FcGoogle size={24} />
                        Sign up with Google
                    </button>
                </div>

                <p className="text-center text-white/50 text-sm mt-8">
                    Already have an account?{' '}
                    <a href="/login" className="text-[#00D4FF] hover:underline font-medium">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;