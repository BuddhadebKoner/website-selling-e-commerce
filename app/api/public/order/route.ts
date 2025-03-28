import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import Cart from "@/models/cart.model";

export async function POST(request: NextRequest) {
   try {
      const {
         owner,
         totalOriginalAmount,
         payableAmount,
         discountAmount,
         taxAmount,
         subtotal,
         products,
      } = await request.json();

      if (
         !owner ||
         totalOriginalAmount === undefined ||
         payableAmount === undefined ||
         discountAmount === undefined ||
         taxAmount === undefined ||
         subtotal === undefined ||
         !products || !Array.isArray(products)
      ) {
         return NextResponse.json(
            { success: false, error: "All fields are required" },
            { status: 400 }
         );
      }

      if (
         isNaN(totalOriginalAmount) ||
         isNaN(payableAmount) ||
         isNaN(discountAmount) ||
         isNaN(taxAmount) ||
         isNaN(subtotal)
      ) {
         return NextResponse.json(
            { success: false, error: "All amounts must be valid numbers" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      const user = await User.findOne({ clerkId: owner }).exec();

      if (!user) {
         return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
         );
      }

      const invoiceId = `INV-${Date.now()}`;

      const productIds = products.map((product) => {
         if (typeof product === 'string') {
            return product;
         }
         else if (product && product._id) {
            return product._id;
         }
         else {
            return product;
         }
      });

      const order = new Order({
         owner: user._id,
         products: productIds,
         totalOriginalAmount,
         payableAmount,
         discountAmount,
         taxAmount,
         subtotal,
         trackId: `TRACK-${Date.now()}`,
         invoiceId,
      });

      await order.save();

      // Clear user's cart
      if (user.cart) {
         await Cart.findByIdAndUpdate(user.cart, { $set: { products: [] } }).exec();
      }

      await User.findByIdAndUpdate(
         user._id,
         { $push: { orders: order._id } },
         { new: true }
      ).exec();

      return NextResponse.json(
         {
            success: true,
            message: "Order created successfully",
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Error creating order:", error);
      return NextResponse.json(
         { success: false, error: "Failed to create order" },
         { status: 500 }
      );
   }
}