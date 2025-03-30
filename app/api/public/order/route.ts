import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {

   const { userId } = getAuth(request);

   if (!userId) {
      return NextResponse.json(
         { success: false, message: "Authentication required" },
         { status: 401 }
      );
   }

   try {
      const requestBody = await request.json();

      const {
         owner,
         totalOriginalAmount,
         payableAmount,
         discountAmount,
         taxAmount,
         subtotal,
         products,
      } = requestBody;

      // Check for required fields
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

      // Validate numerical values
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

      if (owner !== userId) {
         return NextResponse.json(
            { success: false, error: "Owner ID does not match authenticated user" },
            { status: 400 }
         );
      }

      // FIXED: Correct cart population
      const user = await User.findOne({ clerkId: userId })
         .select("_id cart")
         .populate({
            path: 'cart',
            populate: {
               path: 'products'
            }
         })
         .exec();

      if (!user) {
         return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
         );
      }


      // Check if cart or cart products exist
      if (!user.cart || !user.cart.products || user.cart.products.length === 0) {
         return NextResponse.json(
            { success: false, error: "Cart is empty" },
            { status: 400 }
         );
      }

      // Check for pending orders
      const orders = await Order.find({ owner: user._id }).sort({ orderDate: -1 }).exec();

      if (orders.length > 0) {
         const lastOrder = orders[0];

         if (lastOrder.status === "pending" || lastOrder.paymentStatus === "pending" || lastOrder.paymentStatus === "processing" || lastOrder.paymentStatus === "processing" || lastOrder.paymentStatus === "cancelled") {
            return NextResponse.json(
               { success: false, error: "You have a pending order or payment, please complete it before placing a new order" },
               { status: 400 }
            );
         }
      }

      // check for processing orders

      // Build a map of cart products for validation
      const cartProductMap = new Map();

      user.cart.products.forEach((product: { _id: mongoose.Types.ObjectId; title: string; productType: string; price: number; OfferStatus?: string; OfferType?: string; discount?: number }) => {
         const productId = product._id.toString();
         cartProductMap.set(productId, product);
      });

      // FIXED: Handle products as array of IDs or objects with _id
      const productIds = products.map(product =>
         typeof product === 'string' ? product : product._id
      );


      // Validate each product ID is in the cart
      for (const productId of productIds) {
         const idString = productId.toString();

         if (!cartProductMap.has(idString)) {
            return NextResponse.json(
               { success: false, error: `Product with ID ${idString} not found in your cart` },
               { status: 400 }
            );
         }
      }

      // Extract product details from the cart
      const productsDetails = productIds.map((productId) => {
         const idString = productId.toString();
         const cartProduct = cartProductMap.get(idString);

         return {
            title: cartProduct.title,
            productType: cartProduct.productType,
            price: cartProduct.price,
            OfferStatus: cartProduct.OfferStatus || "unabaliable",
            OfferType: cartProduct.OfferType || "percentage",
            discount: cartProduct.discount || 0,
         };
      });


      const invoiceId = `INV-${Date.now()}`;
      const trackId = `TRACK-${Date.now()}`;

      const orderData = {
         owner: user._id,
         products: productsDetails,
         totalOriginalAmount,
         payableAmount,
         discountAmount,
         taxAmount,
         subtotal,
         trackId,
         invoiceId,
         status: "pending",
         paymentStatus: "pending",
         orderDate: new Date()
      };


      const order = new Order(orderData);

      const savedOrder = await order.save();

      // Return success response
      return NextResponse.json(
         {
            success: true,
            message: "Order created successfully",
            orderId: order._id,
            invoiceId: order.invoiceId,
            trackId: order.trackId
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("33. Error creating order:", error);
      if (error instanceof Error) {
         console.error("34. Error message:", error.message);
         console.error("35. Error stack:", error.stack);
      }
      return NextResponse.json(
         { success: false, error: error instanceof Error ? error.message : "Failed to create order" },
         { status: 500 }
      );
   }
}