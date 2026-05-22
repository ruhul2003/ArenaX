import { NextResponse } from "next/server";

export async function middleware(request) {

    // Get cookie value properly
    const token = request.cookies.get("token")?.value;

    const { pathname } = request.nextUrl;

    console.log(`Middleware → Path: ${pathname} | Token: ${!!token}`);

    // Protected routes
    const protectedRoutes = [
        "/all-facilities",
        "/add-facility",
        "/my-bookings",
        "/manage-facilities"
    ];

    // Redirect to login if no token
    if (
        protectedRoutes.some(route => pathname.startsWith(route)) &&
        !token
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Prevent logged in users from visiting login/signup
    if (
        token &&
        (pathname === "/login" || pathname === "/signup")
    ) {
        return NextResponse.redirect(
            new URL("/all-facilities", request.url)
        );
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