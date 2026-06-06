"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Link from "next/link";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    if (user.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(user.password)) {
      setError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(user.password)) {
      setError("Password must contain at least one number");
      setLoading(false);
      return;
    }

    const { data, error: authError } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.image || undefined,
    });


    setLoading(false);

    if (data) {
      redirect("/");
    }

    if (authError) {
      setError(authError.message || "Registration failed");
    }
  };

  const handleGoogleSignin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen bg-[#031637] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Arena<span className="text-[#00D4FF]">X</span>
          </h1>
          <p className="text-white/70 mt-2 text-lg">Create your account</p>
        </div>

        <div className="bg-[#0A1F3D] rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
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

              {/* Profile Picture URL */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Profile Picture URL{" "}
                  <span className="text-white/50 text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-5 py-4 bg-[#031637] border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D4FF]"
                />
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
              className="w-full bg-[#00D4FF] hover:bg-[#00B8E0] disabled:opacity-70 text-[#031637] font-semibold py-4 rounded-2xl text-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider/Separator */}
          <div className="flex justify-center items-center gap-3 opacity-70">
            <Separator className="bg-white/10 flex-1" />
            <div className="whitespace-nowrap text-white/60 text-sm">
              Or sign up with
            </div>
            <Separator className="bg-white/10 flex-1" />
          </div>

          {/* Google Sign In Button */}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#00D4FF] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;