import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      await connectToDatabase();

      const totalCount = await User.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      const users = await User.find()
         .skip(skip)
         .limit(limit);

      if (!users || users.length === 0) {
         return NextResponse.json({ error: "No users found" }, { status: 404 });
      }

      return NextResponse.json(
         {
            message: "Users fetched successfully",
            data: users,
            pagination: {
               currentPage: page,
               totalPages,
               totalItems: totalCount,
               itemsPerPage: limit
            }
         },
         { status: 200 }
      );
   } catch {
      return NextResponse.json(
         { error: "Error in getting users" },
         { status: 500 }
      );
   }
}
