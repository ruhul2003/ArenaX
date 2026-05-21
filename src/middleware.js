import { NextResponse } from "next/server";

export async function middleware(request) {
  const sessionCookie = request.cookies.get("better-auth.session_token") || 
                        request.cookies.get("__secure-better-auth.session_token");

  const { pathname } = request.nextUrl;

  if (!sessionCookie && pathname.startsWith("/all-facilities")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/all-facilities", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/all-facilities/:path*", "/login", "/signup"],
};