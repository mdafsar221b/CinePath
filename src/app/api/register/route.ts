// src/app/api/register/route.ts (NEW)
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password || password.length < 6) {
            return NextResponse.json({ error: "Invalid email or password (min 6 characters)" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("cinepath");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
        }

        const passwordHash = await hash(password, 10);

        const result = await usersCollection.insertOne({
            email: email.toLowerCase(),
            passwordHash,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 });

    } catch (e) {
        console.error("Registration error:", e);
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}