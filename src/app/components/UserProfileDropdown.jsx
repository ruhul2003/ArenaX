'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Calendar, Settings, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { authClient } from "@/lib/auth-client";

const UserProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsOpen(false);
        await authClient.signOut();   // Better than window.location
    };

    const userInitials = user?.name 
        ? user.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2) 
        : (user?.email ? user.email[0].toUpperCase() : 'U');

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 focus:outline-none border border-transparent hover:border-white/10"
            >
                {user?.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#00D4FF]/20"
                        width={36}
                        height={36}
                    />
                ) : (
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#00B8E0] text-[#031637] font-bold text-sm flex items-center justify-center">
                        {userInitials}
                    </div>
                )}

                <div className="hidden lg:flex flex-col items-start text-left max-w-[140px]">
                    <span className="text-sm font-semibold text-white truncate">{user?.name || 'Account'}</span>
                    <span className="text-[11px] text-white/50 truncate">{user?.email}</span>
                </div>

                <ChevronDown size={14} className={`text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0A1F3D] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-white/40 font-medium tracking-wider uppercase">Signed in as</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{user?.name}</p>
                        <p className="text-xs text-white/60 truncate">{user?.email}</p>
                    </div>

                    <div className="px-1.5 py-1 space-y-0.5">
                        <Link
                            href="/my-bookings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Calendar size={18} className="text-white/40" />
                            <span>My Bookings</span>
                        </Link>

                        <Link
                            href="/manage-facilities"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Settings size={18} className="text-white/40" />
                            <span>Manage Facilities</span>
                        </Link>
                    </div>

                    <div className="h-px bg-white/10 my-1 mx-1.5"></div>

                    <div className="px-1.5">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileDropdown;