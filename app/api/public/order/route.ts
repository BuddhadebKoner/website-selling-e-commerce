import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
   console.log("1. Starting order creation process");

   const { userId } = getAuth(request);
   console.log("2. Authenticated userId:", userId);

   if (!userId) {
      console.log("3. No authenticated user found");
      return NextResponse.json(
         { success: false, message: "Authentication required" },
         { status: 401 }
      );
   }

   try {
      const requestBody = await request.json();
      console.log("4. Request body:", JSON.stringify(requestBody, null, 2));

      const {
         owner,
         totalOriginalAmount,
         payableAmount,
         discountAmount,
         taxAmount,
         subtotal,
         products,
      } = requestBody;

      console.log("5. Extracted order data:", {
         owner,
         totalOriginalAmount,
         payableAmount,
         discountAmount,
         taxAmount,
         subtotal,
         productsCount: products ? products.length : 0
      });

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
         console.log("6. Missing required fields");
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
         console.log("7. Invalid numerical values");
         return NextResponse.json(
            { success: false, error: "All amounts must be valid numbers" },
            { status: 400 }
         );
      }

      console.log("8. Connecting to database");
      await connectToDatabase();
      console.log("9. Database connected");

      if (owner !== userId) {
         console.log("10. Owner ID mismatch", { owner, userId });
         return NextResponse.json(
            { success: false, error: "Owner ID does not match authenticated user" },
            { status: 400 }
         );
      }

      // Check if user exists and correctly populate the cart
      console.log("11. Finding user with clerkId:", userId);

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

      console.log("12. User found:", user ? "Yes" : "No");
      console.log("12a. User data:", JSON.stringify(user, null, 2));

      if (!user) {
         return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
         );
      }

      console.log("13. User cart:", JSON.stringify(user.cart, null, 2));

      // Check if cart or cart products exist
      if (!user.cart || !user.cart.products || user.cart.products.length === 0) {
         console.log("14. User cart is empty");
         return NextResponse.json(
            { success: false, error: "Cart is empty" },
            { status: 400 }
         );
      }

      // Check for pending orders
      console.log("15. Checking pending orders");
      const orders = await Order.find({ owner: user._id }).sort({ orderDate: -1 }).exec();
      console.log("16. Found orders:", orders.length);

      if (orders.length > 0) {
         const lastOrder = orders[0];
         console.log("17. Last order status:", lastOrder.status, "payment status:", lastOrder.paymentStatus);

         if (lastOrder.status === "pending" || lastOrder.paymentStatus === "pending") {
            return NextResponse.json(
               { success: false, error: "You have a pending order or payment, please complete it before placing a new order" },
               { status: 400 }
            );
         }
      }

      // Build a map of cart products for validation
      console.log("18. Creating cart product map");
      const cartProductMap = new Map();
      console.log("19. Cart products:", JSON.stringify(user.cart.products, null, 2));

      user.cart.products.forEach((product: { _id: mongoose.Types.ObjectId; title: string; productType: string; price: number; OfferStatus?: string; OfferType?: string; discount?: number }) => {
         const productId = product._id.toString();
         console.log(`20. Mapping product with ID: ${productId}`);
         cartProductMap.set(productId, product);
      });

      // FIXED: Handle products as array of IDs or objects with _id
      console.log("21. Validating order products");
      const productIds = products.map(product =>
         typeof product === 'string' ? product : product._id
      );

      console.log("22. Product IDs to validate:", productIds);

      // Validate each product ID is in the cart
      for (const productId of productIds) {
         const idString = productId.toString();
         console.log(`23. Checking if product exists in cart: ${idString}`);
         console.log(`23a. Cart product keys: ${Array.from(cartProductMap.keys())}`);

         if (!cartProductMap.has(idString)) {
            console.log(`24. Product not found in cart: ${idString}`);
            return NextResponse.json(
               { success: false, error: `Product with ID ${idString} not found in your cart` },
               { status: 400 }
            );
         }
      }

      // Extract product details from the cart
      console.log("25. Extracting product details");
      const productsDetails = productIds.map((productId) => {
         const idString = productId.toString();
         const cartProduct = cartProductMap.get(idString);
         console.log("26. Cart product:", JSON.stringify(cartProduct, null, 2));

         return {
            title: cartProduct.title,
            productType: cartProduct.productType,
            price: cartProduct.price,
            OfferStatus: cartProduct.OfferStatus || "unabaliable",
            OfferType: cartProduct.OfferType || "percentage",
            discount: cartProduct.discount || 0,
         };
      });

      console.log("27. Products details from cart:", JSON.stringify(productsDetails, null, 2));

      const invoiceId = `INV-${Date.now()}`;
      const trackId = `TRACK-${Date.now()}`;
      console.log("28. Creating order with invoice ID:", invoiceId, "and track ID:", trackId);

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

      console.log("29. Order data:", JSON.stringify(orderData, null, 2));

      const order = new Order(orderData);
      console.log("30. Order instance created");

      console.log("31. Saving order");
      const savedOrder = await order.save();
      console.log("32. Order saved successfully:", JSON.stringify(savedOrder, null, 2));

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