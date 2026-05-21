// src/app/api/facilities/[id]/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

// ✅ 1. GET: Fetch data for a single facility to populate the edit form
export async function GET(req, { params }) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        const { id } = await params;
        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        // Find the facility, verifying that the current user owns it
        const facility = await collection.findOne({
            _id: new ObjectId(id),
            owner_email: session.user.email
        });

        if (!facility) {
            return NextResponse.json({ error: "Facility not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: facility }, { status: 200 });
    } catch (error) {
        console.error("GET Single Facility Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ 2. PUT: Save updates submitted from your edit form
export async function PUT(req, { params }) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        // Prepare updated data, explicitly casting numeric values
        const updatedData = {
            name: body.name,
            facility_type: body.facility_type,
            location: body.location,
            price_per_hour: Number(body.price_per_hour),
            capacity: Number(body.capacity),
            available_slots: body.available_slots,
            description: body.description,
            image: body.image,
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id), owner_email: session.user.email },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Facility not found or unauthorized." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Facility updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("PUT Single Facility Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ 3. DELETE: Your functional deletion logic
export async function DELETE(req, { params }) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Facility ID parameter is required" }, { status: 400 });
        }

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        const result = await collection.deleteOne({
            _id: new ObjectId(id),
            owner_email: session.user.email
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ 
                error: "Facility not found or you do not have permission to delete this listing." 
            }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Facility successfully removed." }, { status: 200 });

    } catch (error) {
        console.error("Dynamic Database DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}