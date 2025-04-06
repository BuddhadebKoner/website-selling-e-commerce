import { connectToDatabase } from "@/lib/db";
import Rating from "@/models/rating.model";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { userId } = getAuth(request);

      if (!userId) {
         return NextResponse.json(
            { success: false, message: "Authentication required" },
            { status: 401 }
         );
      }

      const {
         rating,
         comment,
         productIds,
         orderId,
      } = await request.json();

      console.log("Request Body:", {
         rating,
         comment,
         productIds,
         orderId,
      });

      if (!rating || !productIds || !orderId || !Array.isArray(productIds)) {
         return NextResponse.json(
            { success: false, message: "All fields are required" },
            { status: 400 }
         );
      }

      // Validate numerical values
      if (isNaN(rating)) {
         return NextResponse.json(
            { success: false, message: "Rating must be a valid number" },
            { status: 400 }
         );
      }

      // Validate comment length
      if (comment && comment.length > 500) {
         return NextResponse.json(
            { success: false, message: "Comment is too long" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Find user by id
      const user = await User.findOne({ clerkId: userId }).select("_id");
      if (!user) {
         return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
         );
      }

      // Use aggregation pipeline to validate order and products
      const orderValidation = await Order.aggregate([
         {
            $match: {
               _id: new mongoose.Types.ObjectId(orderId),
               owner: user._id,
               status: "completed",
               paymentStatus: "completed",
            }
         },
         {
            $project: {
               products: "$products.productId"
            }
         }
      ]);


      if (orderValidation.length === 0) {
         return NextResponse.json(
            { success: false, message: "Order not found, not completed, or you do not have permission to rate this order" },
            { status: 403 }
         );
      }

      const orderedProductIds = orderValidation[0].products.map((productId: string) => productId.toString());
      const invalidProductIds = productIds.filter(productId => !orderedProductIds.includes(productId));
      if (invalidProductIds.length > 0) {
         return NextResponse.json(
            { success: false, message: `Invalid product IDs: ${invalidProductIds.join(", ")}` },
            { status: 400 }
         );
      }

      // Check if the user has already rated this order for these products
      const existingRating = await Rating.findOne({ user: user._id, products: { $in: productIds }, orderId });
      if (existingRating) {
         return NextResponse.json(
            { success: false, message: "You have already submitted a rating for this order and products" },
            { status: 400 }
         );
      }

      // Create a new rating
      const ratingData = {
         user: user._id,
         products: productIds,
         rating,
         comment,
         orderId,
      };

      const newRating = await Rating.create(ratingData);
      if (!newRating) {
         return NextResponse.json(
            { success: false, message: "Failed to create rating" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         { success: true, message: "Rating created successfully", data: newRating },
         { status: 201 }
      );
   } catch (error) {
      console.error("Internal server error:", error);
      return NextResponse.json(
         { success: false, message: "Internal server error" },
         { status: 500 }
      );
   }
}