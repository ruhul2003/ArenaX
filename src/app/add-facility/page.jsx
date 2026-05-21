'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Upload,
    MapPin,
    Activity,
    Clock,
    FileText,
    CheckCircle,
    Hash
} from 'lucide-react';

const AddFacilityPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        facility_type: 'Cricket Ground',
        location: '',
        capacity: '',
        image: '',
        price_per_hour: '',
        description: '',
        rules: '',
        booking_count: '0', 
    });

    const [timings, setTimings] = useState({
        openTime: '08:00',
        closeTime: '22:00',
    });

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

      try {
          const payload = {
              name: formData.name,
              facility_type: formData.facility_type,
              location: formData.location,
              price_per_hour: parseInt(formData.price_per_hour, 10), 
              capacity: parseInt(formData.capacity, 10),
              description: formData.description,
              image: formData.image.trim(),                                                  
              available_slots: ["08:00 AM - 10:00 AM", "04:00 PM - 06:00 PM"],
              booking_count: parseInt(formData.booking_count, 10) || 0 
          };

          // Fallback to localhost if env isn't loaded
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
          
          // ✅ FIXED: Points directly to your backend AND sends secure cross-origin authentication cookies
          const response = await fetch(`${serverUrl}/facilities`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json' 
              },
              credentials: 'include', // 👈 CRITICAL: This passes the HTTP-only JWT login token to your server
              body: JSON.stringify(payload)
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || data.error || 'Failed to create facility');

          setSuccess(true);
          setTimeout(() => router.push('/all-facilities'), 2000);

      } catch (err) {
          setError(err.message || 'Something went wrong.');
      } finally {
          setLoading(false);
      }
  };

    return (
        <div className="min-h-screen bg-[#031637] text-white px-6 py-12 flex justify-center items-center">
            <div className="w-full max-w-4xl">

                {/* Header Context */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Add New <span className="text-[#00D4FF]">Facility</span>
                    </h1>
                    <p className="text-white/60 mt-2">
                        List a new venue, turf, court, or arena on the ArenaX platform.
                    </p>
                </div>

                {/* Main Dynamic Card Form */}
                <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">

                    {success ? (
                        <div className="py-16 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                            <CheckCircle size={80} className="text-[#00D4FF] animate-bounce" />
                            <h2 className="text-2xl font-bold">Facility Listed Successfully!</h2>
                            <p className="text-white/60 text-center">Redirecting you to the facilities board...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div>
                                <h3 className="text-lg font-semibold text-[#00D4FF] mb-4 flex items-center gap-2">
                                    <Activity size={18} /> Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">Facility Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g., Premium Indoor Football Turf"
                                            className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">Facility Type</label>
                                        <select
                                            name="facility_type"
                                            value={formData.facility_type}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00D4FF] transition"
                                        >
                                            <option value="Cricket Ground">Cricket Ground</option>
                                            <option value="Badminton">Badminton Court</option>
                                            <option value="Football Turf">Football Turf</option>
                                            <option value="Multi-Sport">Multi-Sport</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[#00D4FF] mb-4 flex items-center gap-2">
                                    <MapPin size={18} /> Logistics, Capacity & Pricing
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="lg:col-span-1">
                                        <label className="block text-white/80 text-sm font-medium mb-2">Location Address</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="e.g., Uttara, Dhaka"
                                                className="w-full pl-12 pr-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition"
                                                required
                                            />
                                            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">Capacity (Players)</label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            placeholder="e.g., 22"
                                            className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">Price Per Hour (BDT)</label>
                                        <input
                                            type="number"
                                            name="price_per_hour"
                                            value={formData.price_per_hour}
                                            onChange={handleChange}
                                            placeholder="e.g., 1500"
                                            className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition"
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">Initial Bookings</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="booking_count"
                                                value={formData.booking_count}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="w-full pl-12 pr-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition"
                                                min="0"
                                            />
                                            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[#00D4FF] mb-4 flex items-center gap-2">
                                    <Clock size={18} /> Operational Hours
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#031637] p-6 rounded-2xl border border-white/5">
                                    <div>
                                        <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Opening Time</label>
                                        <input
                                            type="time"
                                            value={timings.openTime}
                                            onChange={(e) => setTimings({ ...timings, openTime: e.target.value })}
                                            className="w-full px-5 py-3 bg-[#0A1F3D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D4FF] transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Closing Time</label>
                                        <input
                                            type="time"
                                            value={timings.closeTime}
                                            onChange={(e) => setTimings({ ...timings, closeTime: e.target.value })}
                                            className="w-full px-5 py-3 bg-[#0A1F3D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D4FF] transition"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[#00D4FF] mb-3 flex items-center gap-2">
                                    <Upload size={18} /> Facility Display Image URL
                                </h3>
                                <p className="text-xs text-white/50 mb-3">Provide a hosted image link showing your arena or court turf layout.</p>

                                <div className="flex gap-3">
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        required
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/your-photo-path.jpg"
                                        className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[#00D4FF] mb-4 flex items-center gap-2">
                                    <FileText size={18} /> Descriptions & Protocols
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Describe the condition, sizing, ventilation, lighting types, and seating accommodation options of the facility..."
                                            className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition resize-none"
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">Ground Rules / Booking Guidelines</label>
                                        <textarea
                                            name="rules"
                                            rows="3"
                                            value={formData.rules}
                                            onChange={handleChange}
                                            placeholder="e.g., Proper sports shoes required. Cancel up to 24 hours in advance. No outside food items allowed inside the cage."
                                            className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF] transition resize-none"
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Error Alert Bar */}
                            {error && (
                                <p className="text-red-500 text-sm text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="sm:w-1/3 bg-transparent hover:bg-white/5 text-white font-medium py-4 rounded-2xl border border-white/20 transition text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-70 text-[#031637] font-bold py-4 rounded-2xl transition hover:scale-[1.01]"
                                >
                                    {loading ? "Saving Records..." : "Publish Facility"}
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddFacilityPage;