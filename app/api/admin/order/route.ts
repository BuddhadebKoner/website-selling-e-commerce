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

      const totalOrders = await Order.countDocuments();
      const totalPages = Math.ceil(totalOrders / limit);

      const orders = await Order.find()
         .populate("owner", "name email")
         .select("-__v -products")
         .skip(skip)
         .limit(limit)

      if (!orders || orders.length === 0) {
         return NextResponse.json(
            { message: "No orders found" },
            { status: 404 }
         )
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
      return NextResponse.json(
         {
            message: "Error fetching orders",
            error: error,
         },
         { status: 500 }
      )
   }
}