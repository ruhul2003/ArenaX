'use client';

import React, { useState } from 'react';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';   // ← Make sure this path is correct

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Use authClient hooks
    const { data: session, isPending } = authClient.useSession();
    const isLoggedIn = !!session?.user;

    const publicLinks = [
        { name: 'Home', href: '/' },
        { name: 'All Facilities', href: '/all-facilities' },
    ];

    const protectedLinks = [
        { name: 'My Bookings', href: '/my-bookings' },
        { name: 'Add Facility', href: '/add-facility' },
        { name: 'Manage My Facilities', href: '/manage-facilities' },
    ];

    const navLinks = isLoggedIn ? [...publicLinks, ...protectedLinks] : publicLinks;

    const handleLogout = async () => {
        await authClient.signOut();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="bg-[#031637] sticky top-0 z-50 border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-5 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl md:text-3xl font-bold text-white tracking-tight"
                    >
                        Arena<span className="text-[#00D4FF]">X</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm md:text-base text-white/90">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="hover:text-white transition-colors duration-200 font-medium relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D4FF] group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Right Side */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    href="/login"
                                    className="text-white/90 hover:text-white px-5 py-2 text-sm md:text-base font-medium transition-colors"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/signup"
                                    className="bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold px-6 md:px-8 py-2.5 text-sm md:text-base rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    SignUp
                                </Link>
                            </>
                        ) : (
                            /* Professional Profile Dropdown */
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-2xl transition-colors"
                                >
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            width={36}
                                            height={36}
                                            className="rounded-full object-cover border border-white/20"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-[#00D4FF] flex items-center justify-center text-[#031637] font-semibold text-lg">
                                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}

                                    <div className="text-left hidden lg:block">
                                        <p className="text-sm font-medium text-white truncate max-w-[150px]">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs text-white/60 truncate max-w-[160px]">
                                            {session.user.email}
                                        </p>
                                    </div>

                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {isProfileOpen && (
                                    <div 
                                        className="absolute right-0 mt-3 w-64 bg-[#0A1F3D] rounded-2xl border border-white/10 shadow-2xl py-2 z-50"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <div className="flex items-center gap-3">
                                                {session.user.image ? (
                                                    <Image
                                                        src={session.user.image}
                                                        alt=""
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-[#00D4FF] flex items-center justify-center text-2xl text-[#031637] font-bold">
                                                        {session.user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-white truncate">{session.user.name}</p>
                                                    <p className="text-sm text-white/60 truncate">{session.user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white/90 hover:text-white transition-colors"
                                            >
                                                <User size={18} />
                                                View Profile
                                            </Link>

                                            <Link
                                                href="/manage-facilities"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white/90 hover:text-white transition-colors"
                                            >
                                                <Settings size={18} />
                                                Manage Facilities
                                            </Link>
                                        </div>

                                        <div className="border-t border-white/10 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                        <ul className="flex flex-col gap-4 text-white/90 text-base">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="block py-2 hover:text-white transition-colors font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            {!isLoggedIn ? (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        className="text-white/90 hover:text-white py-3 font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-[#00D4FF] text-[#031637] font-semibold py-3 rounded-xl text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2 py-2">
                                        {session.user.image ? (
                                            <Image src={session.user.image} alt="" width={48} height={48} className="rounded-full" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#00D4FF] flex items-center justify-center text-3xl text-[#031637] font-bold">
                                                {session.user.name?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-white">{session.user.name}</p>
                                            <p className="text-sm text-white/60">{session.user.email}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl font-medium transition-colors"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
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