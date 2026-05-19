'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        image: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup Data:', formData);
        // Add your signup logic here
    };

    const handleGoogleSignUp = () => {
        console.log('Sign up with Google clicked');
        // Add Google OAuth logic here
    };

    return (
        <div className="min-h-screen bg-[#031637] flex items-center justify-center px-6 py-12">
            <div className=" w-8/12 md:w-5/12 lg:w-6/12">
                {/* Logo & Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Arena<span className="text-[#00D4FF]">X</span>
                    </h1>
                    <p className="text-white/70 mt-2 text-lg">Create your account</p>
                </div>

                {/* Signup Card */}
                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 2 Column Grid for Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
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
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition"
                                    required
                                />
                            </div>

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
                                        placeholder="Create password"
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

                            {/* Profile Image Link (Optional) */}
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
                                    className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF] transition"
                                />
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-white/50 text-sm font-medium">OR</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    {/* Sign up with Google */}
                    <button
                        onClick={handleGoogleSignUp}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-medium py-4 rounded-2xl transition-all duration-200"
                    >
                        <FcGoogle />
                        Sign up with Google
                    </button>
                </div>

                {/* Login Link */}
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