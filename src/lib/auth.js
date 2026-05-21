import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables");
}

let client;
if (process.env.NODE_ENV === "production") {
    client = new MongoClient(process.env.MONGODB_URI);
} else {
    // Re-use connection pool across dev hot-reloads
    if (!global._mongoClient) {
        global._mongoClient = new MongoClient(process.env.MONGODB_URI);
    }
    client = global._mongoClient;
}

const db = client.db("ArenaX");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        user: "Users", 
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
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000", 
});