import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { getAuth } from "@clerk/nextjs/server";

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

// update payment status of a specific order
export async function PATCH(
   request: NextRequest,
   context: { params: { id: string } }
) {
   try {
      await connectToDatabase();
      const { userId } = getAuth(request);
      const { amount } = await request.json();

      if (!amount) {
         return NextResponse.json(
            { success: false, error: "Amount is required" },
            { status: 400 }
         );
      }

      const params = await context.params;
      const { id } = params;

      if (!id) {
         return NextResponse.json(
            { success: false, error: "Order ID is required" },
            { status: 400 }
         );
      }

      // find the order using the id ,trackId
      const existingOrder = await Order.findOne({
         trackId: id,
      })

      if (!existingOrder) {
         return NextResponse.json(
            { success: false, error: "Order not found" },
            { status: 404 }
         );
      }

      // find the user using the clerk id
      const currentUser = await User.findOne({ clerkId: userId });

      if (!currentUser) {
         return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
         );
      }

      // check if the user is the owner of the order
      if (existingOrder.owner.toString() !== currentUser._id.toString()) {
         return NextResponse.json(
            { success: false, error: "You are not the owner of this order" },
            { status: 403 }
         );
      }

      // Order status validation
      if (existingOrder.status === "processing" || existingOrder.status === "completed") {
         return NextResponse.json(
            { success: false, error: "This order cannot be updated" },
            { status: 403 }
         );
      }

      // Payment status validation
      if (existingOrder.paymentStatus === "processing" || existingOrder.paymentStatus === "completed") {
         return NextResponse.json(
            { success: false, error: "Payment for this order has already been processed" },
            { status: 403 }
         );
      }

      // update the order
      const updatedOrder = await Order.findByIdAndUpdate(
         existingOrder._id,
         {
            paymentStatus: "completed",
            status: "processing",
            amount: amount,
         },
         { new: true }
      );

      if (!updatedOrder) {
         return NextResponse.json(
            { success: false, error: "Failed to update order" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         { success: true, message: "Payment status Updated" },
         { status: 200 }
      );
   } catch (error) {
      console.error("Order update error:", error);
      return NextResponse.json({
         success: false,
         error: "Failed to update order",
      }, { status: 500 });
   }
}