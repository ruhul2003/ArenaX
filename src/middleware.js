// src/middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  // Check for the session cookie set by Better Auth
  const sessionCookie = request.cookies.get("better-auth.session_token") || 
                        request.cookies.get("__secure-better-auth.session_token");

  const { pathname } = request.nextUrl;

  // Protect your private app routes if cookie is missing
  if (!sessionCookie && pathname.startsWith("/all-facilities")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth forms
  if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/all-facilities", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/all-facilities/:path*", "/login", "/signup"],
};