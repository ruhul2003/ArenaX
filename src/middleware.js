import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = request.cookies.get("token");
    const { pathname } = request.nextUrl;

    // Public routes that don't need auth
    const publicRoutes = ["/login", "/signup", "/", "/not-found"];

    // Protected routes
    const protectedRoutes = ["/all-facilities", "/add-facility", "/my-bookings", "/manage-facilities"];

    // If user is NOT logged in and tries to access protected route → redirect to login
    if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user IS logged in and tries to access login/signup → redirect to all-facilities
    if (token && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/all-facilities", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/all-facilities/:path*",
        "/add-facility/:path*",
        "/my-bookings/:path*",
        "/manage-facilities/:path*",
        "/login",
        "/signup",
    ],
};