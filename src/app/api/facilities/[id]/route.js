// src/app/api/facilities/[id]/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function DELETE(req, { params }) {
    try {
        // 1. Authenticate the session securely via incoming headers
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        // 2. Extract and await the dynamic route parameter
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Facility ID parameter is required" }, { status: 400 });
        }

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Facilities");

        // 3. Delete document ONLY if the id matches AND the owner_email matches the current user session
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