'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import UserProfileDropdown from './UserProfileDropdown';

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    
    const { data: session, isPending, refetch } = authClient.useSession();
    const user = session?.user;

    // Refetch session when route changes
    useEffect(() => {
        refetch();
    }, [pathname, refetch]);

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
                            <Link href="/" className="hover:text-[#00D4FF] transition duration-200">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/all-facilities" className="hover:text-[#00D4FF] transition duration-200">
                                All Facilities
                            </Link>
                        </li>

                        {user && (
                            <>
                                <li>
                                    <Link href="/my-bookings" className="hover:text-[#00D4FF] transition duration-200">
                                        My Bookings
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/add-facility" className="hover:text-[#00D4FF] transition duration-200">
                                        Add Facility
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/manage-facilities" className="hover:text-[#00D4FF] transition duration-200">
                                        Manage My Facilities
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {isPending ? (
                            <div className="w-24 h-9 rounded-xl bg-white/10 animate-pulse" />
                        ) : user ? (
                            <UserProfileDropdown user={user} />
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-white/90 hover:text-white px-5 py-2 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-[#00D4FF] hover:bg-[#00B8E0] text-[#031637] font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        {!isPending && user && <UserProfileDropdown user={user} />}
                        <button
                            className="text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                        <ul className="flex flex-col gap-4 text-white/90">
                            <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                            <li><Link href="/all-facilities" onClick={() => setIsMobileMenuOpen(false)}>All Facilities</Link></li>

                            {user && (
                                <>
                                    <li><Link href="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>My Bookings</Link></li>
                                    <li><Link href="/add-facility" onClick={() => setIsMobileMenuOpen(false)}>Add Facility</Link></li>
                                    <li><Link href="/manage-facilities" onClick={() => setIsMobileMenuOpen(false)}>Manage My Facilities</Link></li>
                                </>
                            )}
                        </ul>

                        {!user && !isPending && (
                            <div className="mt-6 flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    className="text-center py-3 border border-white/20 rounded-xl"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-center py-3 bg-[#00D4FF] text-[#031637] font-semibold rounded-xl"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
};

export default NavBar;