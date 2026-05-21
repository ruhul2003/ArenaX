// src/app/api/bookings/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req) {
    try {
        // 1. Check user authentication
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to book." }, { status: 401 });
        }

        const body = await req.json();
        
        // Validation check
        if (!body.facility_id || !body.booking_date || !body.time_slot || !body.hours) {
            return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
        }

        await client.connect();
        const db = client.db("ArenaX");
        const collection = db.collection("Bookings");

        // 2. Strict Schema structure matching requirements
        const newBooking = {
            facility_id: body.facility_id,
            facility_name: body.facility_name,
            user_email: session.user.email,       // Track who booked it
            user_name: session.user.name || "",
            booking_date: body.booking_date,      // e.g., "2026-06-15"
            time_slot: body.time_slot,            // e.g., "10:00 AM - 12:00 PM"
            hours: Number(body.hours),
            total_price: Number(body.total_price),
            status: "pending",                     // ✅ Default status requirement
            created_at: new Date()
        };

        const result = await collection.insertOne(newBooking);

        // Optional: Increment booking_count on the target facility
        const facilitiesCollection = db.collection("Facilities");
        await facilitiesCollection.updateOne(
            { _id: body.facility_id },
            { $inc: { booking_count: 1 } }
        ).catch(err => console.error("Increment error skipped safely:", err));

        return NextResponse.json({ success: true, bookingId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error("Database POST Booking Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}