import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token')?.value; 
    const { pathname } = request.nextUrl;

    const protectedPaths = ['/my-bookings', '/add-facility', '/manage-facilities'];

    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/my-bookings/:path*', '/add-facility/:path*', '/manage-facilities/:path*'],
};