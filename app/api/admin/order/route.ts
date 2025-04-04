import { connectToDatabase } from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

// get all orders
export async function GET(request: NextRequest) {
   try {
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      await connectToDatabase();

      const aggregationResult = await Order.aggregate([
         {
            $facet: {
               "paginatedResults": [
                  {
                     $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "ownerDetails"
                     }
                  },
                  {
                     $addFields: {
                        owner: {
                           $cond: {
                              if: { $gt: [{ $size: "$ownerDetails" }, 0] },
                              then: {
                                 _id: { $arrayElemAt: ["$ownerDetails._id", 0] },
                                 name: { $arrayElemAt: ["$ownerDetails.name", 0] },
                                 email: { $arrayElemAt: ["$ownerDetails.email", 0] }
                              },
                              else: null
                           }
                        }
                     }
                  },
                  {
                     $project: {
                        __v: 0,
                        products: 0,
                        ownerDetails: 0
                     }
                  },
                  { $skip: skip },
                  { $limit: limit }
               ],
               "totalCount": [
                  { $count: "count" }
               ]
            }
         }
      ]);

      const orders = aggregationResult[0].paginatedResults;
      const totalOrders = aggregationResult[0].totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalOrders / limit);

      if (!orders || orders.length === 0) {
         return NextResponse.json(
            { message: "No orders found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: "Orders fetched successfully",
            data: orders,
            pagination: {
               currentPage: page,
               totalPages,
               totalItems: totalOrders,
               itemsPerPage: limit
            }
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
         {
            message: "Error fetching orders",
            error: error,
         },
         { status: 500 }
      );
   }
}