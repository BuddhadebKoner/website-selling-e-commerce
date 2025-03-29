import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";

export async function GET(
   request: NextRequest,
   context: { params: { id: string } }
) {
   try {
      const params = await context.params;
      const { id } = params;

      if (!id) {
         return NextResponse.json(
            { success: false, error: "User ID is required" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Check if user exists
      const user = await User.findOne({ clerkId: id }).select("_id")
         .exec();

      if (!user) {
         return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
         );
      }

      const orders = await Order.find({ owner: user._id }).sort({ orderDate: -1 }).exec();

      return NextResponse.json(
         { success: true, orders },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
         { success: false, error: "Failed to fetch orders" },
         { status: 500 }
      );
   }
}