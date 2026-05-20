'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'All Facilities', href: '/all-facilities' },
        { name: 'My Bookings', href: '/my-bookings' }, 
        { name: 'Add Facility', href: '/add-facility' }, 
        { name: 'Manage My Facilities', href: '/manage-facilities' } 

    ];

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

                    {/* Desktop Auth Links */}
                    <div className="hidden md:flex items-center gap-4">
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
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    className="text-white/90 hover:text-white py-3 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-[#00D4FF] text-[#031637] font-semibold py-3 rounded-xl text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    SignUp
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default NavBar;