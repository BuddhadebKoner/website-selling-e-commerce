import { connectToDatabase } from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model"; // Add Product model import
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
   try {
      const { params } = context;
      const resolvedParams = await params;
      const { id } = resolvedParams;

      if (!id) {
         return NextResponse.json(
            { error: "Order ID is required" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Find order by id
      const isOrderExist = await Order.findById(id)
         .select("_id status paymentStatus")
         .lean() as { _id: string; status: string; paymentStatus: string } | null;

      if (!isOrderExist) {
         return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
         );
      }

      // Get current status values
      const { status, paymentStatus } = isOrderExist;

      // Handle both scenarios
      let newStatus = status; // Default: keep current status
      let shouldUpdate = false;

      // Scenario 1: Processing + Pending → Pending
      if (status === "processing" && paymentStatus === "pending") {
         newStatus = "pending";
         shouldUpdate = true;
      }
      // Scenario 2: Processing + Completed → Completed
      else if (status === "processing" && paymentStatus === "completed") {
         newStatus = "completed";
         shouldUpdate = true;
         
         interface CompleteOrder {
            _id: string;
            products: { productId: string }[];
         }

         const completeOrder = await Order.findById(id).lean() as CompleteOrder | null;
         
         if (completeOrder && completeOrder.products && Array.isArray(completeOrder.products)) {
            // Update totalSold for each product
            for (const item of completeOrder.products) {
               const productId = item.productId;
               
               if (productId) {
                  await Product.findByIdAndUpdate(
                     productId,
                     { $inc: { totalSold: 1 } },
                     { new: true }
                  );
               }
            }
         }
      }

      // Only update if conditions match
      if (shouldUpdate) {
         const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true }
         );

         if (!updatedOrder) {
            return NextResponse.json(
               { error: "Failed to update order status" },
               { status: 500 }
            );
         }

         return NextResponse.json(
            {
               message: "Order status updated successfully",
               status: newStatus
            },
            { status: 200 }
         );
      } else {
         // No changes needed
         return NextResponse.json(
            {
               message: "No status change required",
               status: status
            },
            { status: 200 }
         );
      }
   } catch (error) {
      console.error("Error updating order status:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}