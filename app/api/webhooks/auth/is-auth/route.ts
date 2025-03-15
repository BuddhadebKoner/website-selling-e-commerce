import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { clerkId, email } = await request.json();

      if (!clerkId || !email) {
         return NextResponse.json(
            { error: "Clerk ID and email are required" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Check if user already exists
      const existingUser = await User.findOne({ clerkId });

      if (existingUser) {
         return NextResponse.json(
            { message: "User exists"},
            { status: 200 }
         );
      }

      // Create new user
      const newUser = await User.create({
         clerkId,
         email,
      });

      if (!newUser) {
         return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         { message: "User created successfully" },
         { status: 201 }
      );
   } catch (error) {
      console.error("Auth API Error:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}