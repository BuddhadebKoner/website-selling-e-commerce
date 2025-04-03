import { connectToDatabase } from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      await connectToDatabase();

      // Get pagination parameters from URL
      const searchParams = request.nextUrl.searchParams;
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const skip = (page - 1) * limit;

      const orders = await Order.aggregate([
         {
            $match: {
               paymentStatus: "pending",
               status: "processing"
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "owner",
               foreignField: "_id",
               as: "ownerData"
            }
         },
         {
            $unwind: {
               path: "$ownerData",
               preserveNullAndEmptyArrays: true
            }
         },
         {
            $project: {
               _id: 1,
               trackId: 1,
               orderDate: "$createdAt", 
               payableAmount: 1,
               status: 1,
               paymentStatus: 1,
               owner: {
                  _id: "$owner",
                  name: "$ownerData.name"
               }
            }
         },
         {
            $sort: { orderDate: -1 }
         },
         { $skip: skip },
         { $limit: limit }
      ]);

      // Get total count for pagination
      const totalOrders = await Order.countDocuments({
         paymentStatus: "pending",
         status: "processing"
      });

      return NextResponse.json({
         success: true,
         data: orders,
         pagination: {
            total: totalOrders,
            currentPage: page, 
            totalPages: Math.ceil(totalOrders / limit), 
            hasMore: page * limit < totalOrders
         }
      });

   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, error: "Internal Server Error!" },
         { status: 500 }
      );
   }
}