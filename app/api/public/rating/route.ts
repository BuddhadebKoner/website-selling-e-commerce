import { connectToDatabase } from "@/lib/db";
import Rating from "@/models/rating.model";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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

      const { rating: ratingValue, comment, productId, orderId } = await request.json()

      // Input validation
      if (!ratingValue || !productId || !orderId) {
         return NextResponse.json(
            { success: false, error: "All fields are required" },
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

      // Validate comment length
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

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
         return NextResponse.json(
            { success: false, error: "Product not found" },
            { status: 404 }
         );
      }

      // Verify order exists and is valid
      const order = await Order.findById(orderId);
      if (!order) {
         return NextResponse.json(
            { success: false, error: "Order not found" },
            { status: 404 }
         );
      }

      // Verify order belongs to the user
      if (order.owner.toString() !== user._id.toString()) {
         return NextResponse.json(
            { success: false, error: "Unauthorized: Order does not belong to this user" },
            { status: 403 }
         );
      }

      // Verify order is completed
      if (order.paymentStatus !== "completed" || order.status !== "completed") {
         return NextResponse.json(
            { success: false, error: "Cannot rate products from incomplete orders" },
            { status: 400 }
         );
      }

      // Verify product is in the order
      const productInOrder = order.products.some((p: { productId: string }) =>
         p.productId.toString() === productId
      );

      if (!productInOrder) {
         return NextResponse.json(
            { success: false, error: "Product not found in this order" },
            { status: 400 }
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
            { success: false, error: "You have already rated this product" },
            { status: 400 }
         );
      }

      // Create the rating
      const newRating = await Rating.create({
         rating: numericRating,
         comment: comment || "",
         user: user._id,
         products: productId,
         order: orderId
      });

      // Update product rating counts
      const newTotalSum = (product.totalSumOfRating || 0) + numericRating;
      const newTotalRatings = (product.rating?.length || 0) + 1;

      // Update product with new rating information
      const updatedProduct = await Product.findByIdAndUpdate(
         productId,
         {
            $push: { rating: newRating._id },
            $set: {
               totalSumOfRating: newTotalSum,
               totalRating: newTotalRatings
            },
         },
         { new: true }
      );

      if (!updatedProduct) {
         // Rollback if product update fails
         await Rating.findByIdAndDelete(newRating._id);
         return NextResponse.json(
            { success: false, error: "Failed to update product rating" },
            { status: 500 }
         );
      }

      // Return success response
      return NextResponse.json({
         success: true,
         message: "Rating submitted successfully",
         data: {
            ratingId: newRating._id,
            productId,
            rating: numericRating
         }
      });

   } catch (error) {
      console.error("Rating submission error:", error);
      return NextResponse.json(
         { success: false, error: "Internal server error" },
         { status: 500 }
      );
   }
}