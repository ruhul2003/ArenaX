// src/app/api/auth/[...better-auth]/route.js
import { auth } from "@/lib/auth";

// Better Auth exposes a default handler perfectly typed for Web API Specs
export const GET = auth.handler;
export const POST = auth.handler;