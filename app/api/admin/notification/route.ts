import { connectToDatabase } from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
   // find how many orders are  paymentStatus: "pending", status: "processing"
   try {
      await connectToDatabase();

      const result = await Order.aggregate([
         {
            $match: {
               paymentStatus: "pending",
               status: "processing"
            }
         },
         {
            $count: "notificationCount"
         }
      ]);

      // If no orders found, return count as 0
      const notificationCount = result.length > 0 ? result[0].notificationCount : 0;

      return NextResponse.json({
         notificationCount,
         success: true
      });

   } catch {
      return NextResponse.json({
         error: "Failed to fetch notifications",
         status: 500
      })
   }
}