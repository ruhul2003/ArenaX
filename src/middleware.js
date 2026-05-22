import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = request.cookies.get("token");
    const { pathname } = request.nextUrl;

    console.log("Middleware Check → Path:", pathname, "Token:", !!token); // For debugging

    // Public routes
    const isPublicRoute = 
        pathname === "/" || 
        pathname === "/login" || 
        pathname === "/signup" ||
        pathname.startsWith("/api");

    // Protected routes
    const isProtectedRoute = 
        pathname.startsWith("/all-facilities") ||
        pathname.startsWith("/add-facility") ||
        pathname.startsWith("/my-bookings") ||
        pathname.startsWith("/manage-facilities");

    // If trying to access protected route WITHOUT token → redirect to login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If logged in and trying to access login/signup → redirect to all-facilities
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
        "/"
    ],
};