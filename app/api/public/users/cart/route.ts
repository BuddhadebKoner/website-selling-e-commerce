import Cart from "@/models/cart.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { user, productId, cartId } = await request.json();

      // Validate required fields
      if (!user || !productId) {
         return NextResponse.json(
            { success: false, error: "User and Product ID are required" },
            { status: 400 }
         );
      }

      // Check if the user exists
      const isUserExist = await User.findOne({ clerkId: user }).select("_id");
      if (!isUserExist) {
         return NextResponse.json(
            { success: false, error: "User does not exist" },
            { status: 400 }
         );
      }

      // Check if the product exists
      const isProductExist = await Product.findById(productId).select("_id price");
      if (!isProductExist) {
         return NextResponse.json(
            { success: false, error: "Product does not exist" },
            { status: 400 }
         );
      }

      if (cartId) {
         // First check if cart exists and how many products it has
         const existingCart = await Cart.findById(cartId);
         if (!existingCart) {
            return NextResponse.json(
               { success: false, error: "Cart not found" },
               { status: 404 }
            );
         }

         // Check if product is already in cart
         if (existingCart.products.includes(isProductExist._id)) {
            return NextResponse.json(
               { success: false, error: "This product is already in your cart" },
               { status: 400 }
            );
         }

         // Check if cart already has 5 products
         if (existingCart.products.length >= 5) {
            return NextResponse.json(
               {
                  success: false,
                  error: "Cart limit reached. Maximum 5 products allowed.",
                  productsCount: existingCart.products.length,
                  maxAllowed: 5
               },
               { status: 400 }
            );
         }

         // Update existing cart: add product and update total amount in one operation
         const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            {
               $push: { products: isProductExist._id },
               $inc: { totalAmount: isProductExist.price }
            },
            { new: true }
         ).select("_id products");

         if (!updatedCart) {
            return NextResponse.json(
               { success: false, error: "Failed to update cart. Please try again." },
               { status: 500 }
            );
         }

         // Update the user's cart reference with consistent field name
         const updatedUser = await User.findByIdAndUpdate(
            isUserExist._id,
            { $push: { cart: updatedCart._id } },
            { new: true }
         ).select("_id");

         if (!updatedUser) {
            return NextResponse.json(
               { success: false, error: "Failed to update user. Please try again." },
               { status: 500 }
            );
         }

         return NextResponse.json(
            {
               success: true,
               message: "Product added to cart successfully",
               productsCount: updatedCart.products.length,
               remainingSlots: 5 - updatedCart.products.length
            },
            { status: 200 }
         );

      } else {
         // Create a new cart if no cartId provided
         const newCart = await Cart.create({
            user: isUserExist._id,
            products: [isProductExist._id],
            totalAmount: isProductExist.price
         });

         if (!newCart) {
            return NextResponse.json(
               { success: false, error: "Failed to create cart. Please try again." },
               { status: 500 }
            );
         }

         // Update user with new cart reference
         const updatedUser = await User.findByIdAndUpdate(
            isUserExist._id,
            { $push: { cart: newCart._id } },
            { new: true }
         ).select("_id");

         if (!updatedUser) {
            return NextResponse.json(
               { success: false, error: "Failed to update user. Please try again." },
               { status: 500 }
            );
         }

         return NextResponse.json(
            {
               success: true,
               message: "New cart created successfully",
               productsCount: 1,
               remainingSlots: 4
            },
            { status: 201 }
         );
      }
   } catch (error: any) {
      console.error("Error in POST /cart:", error);

      // Handle different types of errors
      if (error.name === "ValidationError") {
         return NextResponse.json(
            { success: false, error: "Validation error: " + error.message },
            { status: 400 }
         );
      } else if (error.name === "CastError") {
         return NextResponse.json(
            { success: false, error: "Invalid ID format" },
            { status: 400 }
         );
      } else if (error.code === 11000) { // Duplicate key error
         return NextResponse.json(
            { success: false, error: "Duplicate entry detected" },
            { status: 409 }
         );
      }

      return NextResponse.json(
         { success: false, error: "Internal Server Error. Please try again later." },
         { status: 500 }
      );
   }
}