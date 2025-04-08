import { connectToDatabase } from "@/lib/db";
import Rating from "@/models/rating.model";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Add this interface at the top of your file after the imports
interface MongoError extends Error {
  code?: number;
}

export async function POST(request: NextRequest) {
   try {
      // Authentication check
      const { userId } = getAuth(request);
      if (!userId) {
         return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 }
         );
      }

      const { rating: ratingValue, comment, productId, orderId } = await request.json();

      // Input validation
      if (!ratingValue || !productId || !orderId) {
         return NextResponse.json(
            { success: false, error: "Rating value, product ID, and order ID are required" },
            { status: 400 }
         );
      }

      // Validate rating value
      const numericRating = Number(ratingValue);
      if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
         return NextResponse.json(
            { success: false, error: "Rating must be a number between 1 and 5" },
            { status: 400 }
         );
      }

      // Validate comment length if provided
      if (comment && comment.length > 500) {
         return NextResponse.json(
            { success: false, error: "Comment is too long (max 500 characters)" },
            { status: 400 }
         );
      }

      // Connect to database
      await connectToDatabase();

      // Verify user exists
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
         return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
         );
      }

      // Validate MongoDB ObjectId format for productId and orderId
      if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(orderId)) {
         return NextResponse.json(
            { success: false, error: "Invalid product ID or order ID format" },
            { status: 400 }
         );
      }

      // Use a single aggregation to validate order and product in one database call
      const orderDetails = await Order.aggregate([
         { $match: { _id: new mongoose.Types.ObjectId(orderId), owner: user._id } },
         {
            $project: {
               isCompleted: {
                  $and: [
                     { $eq: ["$paymentStatus", "completed"] },
                     { $eq: ["$status", "completed"] }
                  ]
               },
               productInOrder: {
                  $anyElementTrue: {
                     $map: {
                        input: "$products",
                        as: "product",
                        in: { $eq: ["$$product.productId", new mongoose.Types.ObjectId(productId)] }
                     }
                  }
               }
            }
         }
      ]).exec();

      // Check if order exists and belongs to user
      if (!orderDetails || orderDetails.length === 0) {
         return NextResponse.json(
            { success: false, error: "Order not found or does not belong to this user" },
            { status: 404 }
         );
      }

      const orderData = orderDetails[0];

      // Check if order is completed
      if (!orderData.isCompleted) {
         return NextResponse.json(
            { success: false, error: "Cannot rate products from incomplete orders" },
            { status: 400 }
         );
      }

      // Check if product is in the order
      if (!orderData.productInOrder) {
         return NextResponse.json(
            { success: false, error: "Product not found in this order" },
            { status: 400 }
         );
      }

      // Verify product exists (still needed for rating calculation)
      const product = await Product.findById(productId);
      if (!product) {
         return NextResponse.json(
            { success: false, error: "Product not found" },
            { status: 404 }
         );
      }

      // Check if user has already rated this product for this order
      const existingRating = await Rating.findOne({
         user: user._id,
         products: productId,
         order: orderId
      });

      if (existingRating) {
         return NextResponse.json(
            { success: false, error: "You have already rated this product for this order" },
            { status: 400 }
         );
      }

      // Use a session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
         // Create the rating
         const newRating = await Rating.create([{
            rating: numericRating,
            comment: comment || "",
            user: user._id,
            products: productId,
            order: orderId
         }], { session });

         // Calculate new rating metrics
         const newTotalSum = (product.totalSumOfRating || 0) + numericRating;
         const newTotalRatings = (product.rating?.length || 0) + 1;
         const averageRating = newTotalSum / newTotalRatings;

         // Update product with new rating information
         await Product.findByIdAndUpdate(
            productId,
            {
               $push: { rating: newRating[0]._id },
               $set: {
                  totalSumOfRating: newTotalSum,
                  totalRating: newTotalRatings,
                  averageRating: parseFloat(averageRating.toFixed(1))
               },
            },
            { session, new: true }
         );

         // Commit the transaction
         await session.commitTransaction();
         session.endSession();

         // Return success response
         return NextResponse.json({
            success: true,
            message: "Rating submitted successfully",
            data: {
               ratingId: newRating[0]._id,
               productId,
               rating: numericRating,
               averageRating: parseFloat(averageRating.toFixed(1))
            }
         });
      } catch (error) {
         // Abort transaction if any operation fails
         await session.abortTransaction();
         session.endSession();

         // Handle duplicate key error (race condition)
         if ((error as MongoError).code === 11000) {
            return NextResponse.json(
               { success: false, error: "You have already rated this product for this order" },
               { status: 400 }
            );
         }

         throw error; 
      }
   } catch (error) {
      console.error("Rating submission error:", error);
      return NextResponse.json(
         { success: false, error: "Internal server error" },
         { status: 500 }
      );
   }
}