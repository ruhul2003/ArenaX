import { NextResponse } from "next/server";

export async function middleware(request) {
  // ✅ Read the custom JWT auth cookie set by the Express backend
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define paths that require an active login session
  const protectedRoutes = [
    "/all-facilities",
    "/add-facility",
    "/manage-facilities", // 👈 Added protection for the management panel
    "/my-bookings"
  ];

  // 1. Protect internal paths from unauthenticated guests
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!token && isProtected) {
    // Save original destination to redirect back post-login if desired later
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Prevent logged-in users from accessing entry gates (login/signup) again
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url)); // 👈 Redirecting home ('/') is safer if all-facilities is a partial view
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/all-facilities/:path*", 
    "/add-facility/:path*", 
    "/manage-facilities/:path*",
    "/my-bookings/:path*",
    "/login", 
    "/signup"
  ],
};