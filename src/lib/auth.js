import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export const auth = betterAuth({
    database: mongodbAdapter(client.db("ArenaX"), {
        user: "Users",
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 6,
    },

    appName: "ArenaX",

    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",   // ← Added this

    advanced: {
        defaultCookieAttributes: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        },
    },
});