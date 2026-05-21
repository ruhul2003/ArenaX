// src/app/api/facilities/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { MongoClient, ObjectId } from "mongodb"; // ✅ Added ObjectId import

const client = new MongoClient(process.env.MONGODB_URI);

// ✅ GET: Fetch only the facilities created by the logged-in user
export async function GET(req) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        // Find all documents where owner_email matches the current session user's email
        const userFacilities = await collection
            .find({ owner_email: session.user.email })
            .toArray();

        return NextResponse.json({ success: true, data: userFacilities }, { status: 200 });

    } catch (error) {
        console.error("Database GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ POST: Keep your existing upload functionality intact
export async function POST(req) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        const body = await req.json();
        
        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        // Exact schema matching your database fields precisely
        const newFacility = {
            name: body.name,
            facility_type: body.facility_type,
            location: body.location,
            price_per_hour: body.price_per_hour,
            capacity: body.capacity,
            available_slots: body.available_slots,
            description: body.description,
            image: body.image,
            owner_email: session.user.email, // Linked directly as a string field
            booking_count: body.booking_count || 0
        };

        const result = await collection.insertOne(newFacility);
        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error("Database POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ DELETE: Remove a specific facility listing securely using query parameters
export async function DELETE(req) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        // Parse query parameter string out of url instance (?id=...)
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Facility ID reference parameter is missing." }, { status: 400 });
        }

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        // Securely delete document only if target ID matches AND ownership email matches the active session
        const result = await collection.deleteOne({
            _id: new ObjectId(id),
            owner_email: session.user.email
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Facility not found or unauthorized to delete" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Listing deleted safely" }, { status: 200 });

    } catch (error) {
        console.error("Database DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}