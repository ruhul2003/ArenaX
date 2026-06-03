'use client';

import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";

const NavBar = () => {
    // সেশন থেকে ইউজার ডেটা নেওয়া
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // সাইন আউট হ্যান্ডেলার
    const handleSignOut = async () => {
        await authClient.signOut();
    };

    return (
        <div className="bg-[#031637] sticky top-0 z-50 border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-5 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        Arena<span className="text-[#00D4FF]">X</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-white/90">
                        <li>
                            <Link href="/" className="text-base font-medium text-white hover:text-[#00D4FF] transition duration-200">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/all-facilities" className="text-base font-medium text-white hover:text-[#00D4FF] transition duration-200">
                                All Facilities
                            </Link>
                        </li>
                        <li>
                            <Link href="/my-bookings" className="text-base font-medium text-white hover:text-[#00D4FF] transition duration-200">   
                                My Bookings
                            </Link>
                        </li>
                        <li>
                            <Link href="/add-facility" className="text-base font-medium text-white hover:text-[#00D4FF] transition duration-200">   
                                Add Facility
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-facilities" className="text-base font-medium text-white hover:text-[#00D4FF] transition duration-200">   
                                Manage My Facilities
                            </Link>
                        </li>
                    </ul>

                    {/* Desktop Actions Section (Conditional Rendering based on User Session) */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/profile" className="flex items-center gap-2">
                                    <Avatar className="w-10 h-10 border border-[#00D4FF]/30">
                                        <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                                        <Avatar.Fallback className="bg-[#0A1F3D] text-[#00D4FF] font-bold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </Avatar.Fallback>
                                    </Avatar>
                                </Link>
                                <button 
                                    onClick={handleSignOut}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-4 py-2 text-sm rounded-xl transition-all duration-200 flex items-center gap-2"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-white/90 hover:text-white px-5 py-2 text-base font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/signup" className="bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold px-6 py-2.5 text-base rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            className="text-white p-2 focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                        <ul className="flex flex-col gap-4 text-white/90 text-base">
                            <li>
                                <Link href="/" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/all-facilities" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    All Facilities
                                </Link>
                            </li>
                            <li>
                                <Link href="/my-bookings" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>   
                                    My Bookings
                                </Link>
                            </li>
                            <li>
                                <Link href="/add-facility" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>   
                                    Add Facility
                                </Link>
                            </li>
                            <li>
                                <Link href="/manage-facilities" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>   
                                    Manage My Facilities
                                </Link>
                            </li>
                        </ul>

                        {/* Mobile Actions Section */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    {/* Mobile User Profile Info */}
                                    <Link 
                                        href="/profile" 
                                        className="flex items-center gap-3 p-3 bg-[#0A1F3D] rounded-xl border border-white/5"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Avatar className="w-10 h-10 border border-[#00D4FF]/30">
                                            <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                                            <Avatar.Fallback className="bg-[#031637] text-[#00D4FF] font-bold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-medium">{user?.name}</span>
                                            <span className="text-white/50 text-xs">View Profile</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-3 rounded-xl text-center flex items-center justify-center gap-2 transition-colors w-full"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        className="text-white/90 hover:text-white py-3 font-medium text-center border border-white/10 rounded-xl"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="bg-[#00D4FF] text-[#031637] font-semibold py-3 rounded-xl text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default NavBar;