import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const protectedPaths = ['/my-bookings', '/add-facility', '/manage-facilities'];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        const cookieHeader = request.headers.get('cookie') || '';
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

        try {
            const authCheck = await fetch(`${serverUrl}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Cookie': cookieHeader, 
                },
            });

            if (!authCheck.ok) {
                const loginUrl = new URL('/login', request.url);
                return NextResponse.redirect(loginUrl);
            }
        } catch (error) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/my-bookings/:path*', '/add-facility/:path*', '/manage-facilities/:path*'],
};