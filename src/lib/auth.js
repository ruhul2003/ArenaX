// src/lib/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables");
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("ArenaX");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        // Map core user accounts directly into your specific collection
        user: "Users", 
        
        // Better Auth requires these schemas to maintain authentication cycles;
        // they can reside cleanly inside your ArenaX database alongside it.
        session: "auth_sessions", 
        account: "auth_accounts", 
        verification: "auth_verifications"
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 6,
    },

    appName: "ArenaX",
    baseURL: "http://localhost:3000", 
});