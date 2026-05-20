import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // ✅ Public routes - anyone can access
    const publicRoutes = [
        "/",
        "/login",
        "/register",
        "/all-facilities",
        "/facility"
    ];

    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => 
        pathname === route || pathname.startsWith(route)
    );

    // If user is NOT logged in and tries to access protected route
    if (!sessionCookie && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user IS logged in and tries to access login or register
    if (sessionCookie && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
        return NextResponse.redirect(new URL("/all-facilities", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ]
};