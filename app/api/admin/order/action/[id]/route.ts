import { connectToDatabase } from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   context: { params: { id: string } }
) {
   try {
      const params = await context.params;
      const { id } = params;

      if (!id) {
         return NextResponse.json(
            { error: "Order ID is required" },
            { status: 400 }
         );
      }

      // find order by id
      const isOrderExist = await Order.findById(id)
         .select("_id status paymentStatus")
         .lean() as { _id: string; status: string; paymentStatus: string } | null;

      if (!isOrderExist) {
         return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
         );
      }

      if (isOrderExist.status !== "processing" || isOrderExist.paymentStatus !== "pending") {
         return NextResponse.json(
            { error: "Order status is not processing" },
            { status: 400 }
         );
      }

      // update order status processing to pending
      const updatedOrder = await Order.findByIdAndUpdate(
         id,
         { status: "pending" },
         { new: true }
      )

      return NextResponse.json(
         { message: "Order status updated successfully"},
         { status: 200 }
      )

   } catch (error) {
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}