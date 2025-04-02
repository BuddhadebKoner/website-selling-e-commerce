import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   request: NextRequest,
   context: { params: { status: string } }
) {
   try {
      const params = await context.params;
      const { status } = params;

      if (!status) {
         return NextResponse.json(
            { error: "Status is required" },
            { status: 400 }
         );
      }

      // status must be ["pending", "processing", "completed", "cancelled"] those
      const validStatuses = [
         "pending",
         "processing",
         "completed",
         "cancelled",
      ];
      if (!validStatuses.includes(status)) {
         return NextResponse.json(
            { error: "Invalid status" },
            { status: 400 }
         );
      }

      // Fetch orders based on status using aggregation pipeline
      const orders = await Order.aggregate([
         // Match orders with the specified status
         {
            $match: { status }
         },
         // Lookup owner information
         {
            $lookup: {
               from: "users", // Assuming the collection name is 'users'
               localField: "owner",
               foreignField: "_id",
               as: "ownerData"
            }
         },
         // Unwind the owner array
         {
            $unwind: {
               path: "$ownerData",
               preserveNullAndEmptyArrays: true
            }
         },
         // Project to shape the response
         {
            $project: {
               __v: 0,
               updatedAt: 0,
               "owner": {
                  _id: "$owner",
                  name: "$ownerData.name"
               }
            }
         },
         // Sort by creation date descending
         {
            $sort: { createdAt: -1 }
         }
      ]);

      if (!orders || orders.length === 0) {
         return NextResponse.json(
            { message: "No orders found!" },
            { status: 203 }
         );
      }

      return NextResponse.json(
         {
            message: "Orders fetched successfully!",
            orders,
         },
         { status: 200 }
      );

   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { error: "Internal Server Error!" },
         { status: 500 }
      );
   }
};