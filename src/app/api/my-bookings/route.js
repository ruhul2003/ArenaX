import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

// GET: Fetch all bookings for logged-in user
export async function GET(req) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
        }

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Bookings");

        const bookings = await collection
            .find({ user_email: session.user.email })
            .sort({ created_at: -1 })
            .toArray();

        return NextResponse.json({ success: true, data: bookings }, { status: 200 });
    } catch (error) {
        console.error("Fetch My Bookings Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Cancel a specific pending booking
export async function DELETE(req) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse booking ID from URL parameters (?id=...)
        const { searchParams } = new URL(req.url);
        const bookingId = searchParams.get("id");

        if (!bookingId) {
            return NextResponse.json({ error: "Missing Booking ID" }, { status: 400 });
        }

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Bookings");

        // Find the booking to make sure it belongs to this user and is still "pending"
        const booking = await collection.findOne({ _id: new ObjectId(bookingId) });
        
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        if (booking.user_email !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (booking.status !== "pending") {
            return NextResponse.json({ error: "Only pending bookings can be cancelled" }, { status: 400 });
        }

        // Delete the booking record from the collection
        await collection.deleteOne({ _id: new ObjectId(bookingId) });

        return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Cancel Booking Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}