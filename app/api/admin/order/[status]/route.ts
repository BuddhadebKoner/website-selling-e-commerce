// fetch order based on sttus slug

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

      // Fetch orders based on status
      const orders = await Order.find(
         { status },
      )
         // populate owner with only name field
         .populate(
         {
            path: "owner",
            select: "name"
         }
         )
         .select(
         "-__v -updatedAt"
         )
         .sort({ createdAt: -1 });

      if (!orders) {
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
      return NextResponse.json(
         { error: "Internal Server Error!" },
         { status: 500 }
      );
   }
};