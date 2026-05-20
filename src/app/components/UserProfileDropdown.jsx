'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { User, LogOut, Calendar, Settings, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const UserProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    // Close dropdown when clicking outside
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
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/login');
                        router.refresh();
                    }
                }
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Fallback initials if user image isn't available
    const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 focus:outline-none border border-transparent hover:border-white/10"
            >
                {user?.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#00D4FF]/20"
                        width={32}
                        height={32}
                    />
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#00B8E0] text-[#031637] font-bold text-sm flex items-center justify-center shadow-md">
                        {userInitials}
                    </div>
                )}
                <div className="hidden lg:flex flex-col items-start text-left max-w-[120px]">
                    <span className="text-sm font-semibold text-white truncate w-full">{user?.name || 'Account'}</span>
                    <span className="text-[11px] text-white/50 truncate w-full">{user?.email}</span>
                </div>
                <ChevronDown size={14} className={`text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0A1F3D] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-white/10 mb-1">
                        <p className="text-xs text-white/40 font-medium tracking-wider uppercase">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate mt-0.5">{user?.name || 'User'}</p>
                        <p className="text-xs text-white/60 truncate">{user?.email}</p>
                    </div>

                    {/* Navigation Items */}
                    <div className="px-1.5 space-y-0.5">
                        <Link
                            href="/my-bookings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <Calendar size={18} className="text-white/40 group-hover:text-[#00D4FF] transition-colors" />
                            <span>My Bookings</span>
                        </Link>

                        <Link
                            href="/manage-facilities"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <Settings size={18} className="text-white/40 group-hover:text-[#00D4FF] transition-colors" />
                            <span>Manage Facilities</span>
                        </Link>
                    </div>

                    <div className="h-px bg-white/10 my-1.5"></div>

                    {/* Logout Option */}
                    <div className="px-1.5">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left font-medium"
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