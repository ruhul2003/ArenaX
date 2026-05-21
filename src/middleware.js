import { NextResponse } from "next/server";

export async function middleware(request) {
  const sessionCookie = request.cookies.get("token");

  const { pathname } = request.nextUrl;

  if (!sessionCookie && (pathname.startsWith("/all-facilities") || pathname.startsWith("/add-facility"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/all-facilities", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/all-facilities/:path*", 
    "/add-facility/:path*", 
    "/login", 
    "/signup"
  ],
};