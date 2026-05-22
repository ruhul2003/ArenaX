import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = request.cookies.get("token");
    const { pathname } = request.nextUrl;

    console.log(`🔍 Middleware Check → Path: ${pathname} | Token: ${!!token}`);

    const protectedRoutes = [
        "/all-facilities",
        "/add-facility",
        "/my-bookings",
        "/manage-facilities"
    ];

    // Redirect to login if accessing protected route without token
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
        console.log("🚫 Redirecting to /login - No token");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect logged-in users away from auth pages
    if (token && (pathname === "/login" || pathname === "/signup")) {
        console.log("✅ Redirecting to /all-facilities - Already logged in");
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