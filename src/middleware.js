// import { NextResponse } from 'next/server';

// export function middleware(request) {
//     const token = request.cookies.get('token')?.value; 
//     const { pathname } = request.nextUrl;

//     const protectedPaths = ['/my-bookings', '/add-facility', '/manage-facilities'];

//     const isProtected = protectedPaths.some(path => pathname.startsWith(path));

//     if (isProtected && !token) {
//         const loginUrl = new URL('/login', request.url);
//         return NextResponse.redirect(loginUrl);
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/my-bookings/:path*', '/add-facility/:path*', '/manage-facilities/:path*'],
// };


import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const protectedPaths = ['/my-bookings', '/add-facility', '/manage-facilities'];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        // Extract the cookie string from the incoming client request headers
        const cookieHeader = request.headers.get('cookie') || '';
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

        try {
            // Ping your Express backend to check if the session cookie is valid
            const authCheck = await fetch(`${serverUrl}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Cookie': cookieHeader, // Pass the cookie headers explicitly
                },
            });

            // If the backend says unauthorized, kick user to login page
            if (!authCheck.ok) {
                const loginUrl = new URL('/login', request.url);
                return NextResponse.redirect(loginUrl);
            }
        } catch (error) {
            // Fail safe: If backend cannot be reached, fallback redirect to login
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/my-bookings/:path*', '/add-facility/:path*', '/manage-facilities/:path*'],
};