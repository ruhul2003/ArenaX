// src/app/api/facilities/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables");
}

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req) {
    try {
        // 1. Authenticate the user calling this request via Better Auth headers
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        // If no valid session token exists, throw a 401 Unauthorized block
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized. Please sign in to list a facility." },
                { status: 401 }
            );
        }

        // 2. Extract the payload sent from the frontend form
        const body = await req.json();
        const { name, location, pricePerHour, description, category, rules, images, timings } = body;

        // 3. Connect to your database cluster
        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        // 4. Construct the complete document attaching the creator's record details
        const newFacility = {
            name,
            location,
            pricePerHour,
            description,
            category,
            rules,
            images,
            timings,
            createdBy: {
                userId: session.user.id,
                name: session.user.name,
                email: session.user.email,
            },
            createdAt: new Date().toISOString(),
        };

        // 5. Insert document into the "Facilities" collection
        const result = await collection.insertOne(newFacility);

        return NextResponse.json(
            { success: true, facilityId: result.insertedId },
            { status: 201 }
        );

    } catch (error) {
        console.error("Database Facility POST Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}