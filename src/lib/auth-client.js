import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Point directly to your Next.js app domain
    baseURL: "http://localhost:3000" 
});