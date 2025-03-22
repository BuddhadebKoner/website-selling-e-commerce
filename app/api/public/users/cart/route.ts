import Cart from "@/models/cart.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   // check the user is login or not 
   const { userId } = getAuth(request);
   // No user authenticated
   if (!userId) {
      return NextResponse.json(
         { success: false, message: "Authentication required" },
         { status: 401 }
      );
   }

   try {
      const { productId, cartId } = await request.json();
      const user = userId;
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

         // Update the user's cart id , cart is not array there , only one id is there
         const updatedUser = await User.findByIdAndUpdate(
            isUserExist._id,
            { cart: updatedCart._id },
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
   } catch (error) {
      return NextResponse.json(
         { success: false, error: "Internal Server Error" },
         { status: 500 }
      );
   }
}

export async function DELETE(request: NextRequest) {
   // check if the user is logged in
   const { userId } = getAuth(request);
   // No user authenticated
   if (!userId) {
      return NextResponse.json(
         { success: false, message: "Authentication required" },
         { status: 401 }
      );
   }

   try {
      const { cartId, productId } = await request.json();
      // check the cart id not empty
      if (!cartId) {
         return NextResponse.json(
            { success: false, error: "Cart ID is required" },
            { status: 400 }
         );
      }
      // check the product id not empty
      if (!productId) {
         return NextResponse.json(
            { success: false, error: "Product ID is required" },
            { status: 400 }
         );
      }

      // check cart exists or not
      const isCartExist = await Cart.findById(cartId);
      if (!isCartExist) {
         return NextResponse.json(
            { success: false, error: "Cart not found" },
            { status: 404 }
         );
      }

      // check the product exists in the cart or not
      if (!isCartExist.products.includes(productId)) {
         return NextResponse.json(
            { success: false, error: "Product not found in cart" },
            { status: 404 }
         );
      }

      // user exists or not - FIXED: Using findOne instead of findById with an object
      const isUserExist = await User.findOne({ clerkId: userId }).select("_id");
      if (!isUserExist) {
         return NextResponse.json(
            { success: false, error: "User does not exist" },
            { status: 400 }
         );
      }

      // check the cart belongs to the user or not
      if (isCartExist.user.toString() !== isUserExist._id.toString()) {
         return NextResponse.json(
            { success: false, error: "Unauthorized access" },
            { status: 403 }
         );
      }

      // Get product details to calculate price reduction
      const productToRemove = await Product.findById(productId);
      if (!productToRemove) {
         return NextResponse.json(
            { success: false, error: "Product not found" },
            { status: 404 }
         );
      }

      // check if this is the last product in the cart
      if (isCartExist.products.length === 1) {
         // delete cart collection and update user
         const deleteCart = await Cart.findByIdAndDelete(cartId);
         if (!deleteCart) {
            return NextResponse.json(
               { success: false, error: "Failed to delete cart. Please try again." },
               { status: 500 }
            );
         }

         // remove cart reference from user
         const updatedUser = await User.findByIdAndUpdate(
            isUserExist._id,
            { $unset: { cart: "" } }, // FIXED: Using $unset instead of $pull for a single reference
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
               message: "Cart deleted successfully",
               productsCount: 0,
               remainingSlots: 5
            },
            { status: 200 }
         );
      }

      // remove product from cart and update total amount
      // FIXED: Correctly using productId with $pull
      const updatedCart = await Cart.findByIdAndUpdate(
         cartId,
         {
            $pull: { products: productId },
            $inc: { totalAmount: -productToRemove.price } // Using the product's actual price
         },
         { new: true }
      ).select("_id products");

      if (!updatedCart) {
         return NextResponse.json(
            { success: false, error: "Failed to update cart. Please try again." },
            { status: 500 }
         );
      }

      return NextResponse.json(
         {
            success: true,
            message: "Product removed from cart successfully",
            productsCount: updatedCart.products.length,
            remainingSlots: 5 - updatedCart.products.length
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Cart deletion error:", error);
      return NextResponse.json(
         { success: false, error: "Internal Server Error" },
         { status: 500 }
      );
   }
}