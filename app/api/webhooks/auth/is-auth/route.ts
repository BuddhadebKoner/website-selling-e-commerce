import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { clerkId, email, fullName } = await request.json();

      if (!clerkId || !email || !fullName) {
         return NextResponse.json(
            { error: "Clerk ID and email are required" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Check if user exists using aggregation pipeline
      const existingUserArray = await User.aggregate([
         { $match: { clerkId } },
         {
            $lookup: {
               from: "carts", // The collection name for carts
               localField: "cart",
               foreignField: "_id",
               as: "cartData"
            }
         },
         { $unwind: { path: "$cartData", preserveNullAndEmptyArrays: true } },
         {
            $lookup: {
               from: "products", // The collection name for products
               localField: "cartData.products",
               foreignField: "_id",
               as: "cartData.productDetails"
            }
         },
         {
            $project: {
               _id: 1,
               cart: "$cartData._id",
               totalAmount: "$cartData.totalAmount",
               products: {
                  $map: {
                     input: "$cartData.productDetails",
                     as: "product",
                     in: {
                        _id: "$$product._id",
                        title: "$$product.title",
                        price: "$$product.price",
                        bannerImageUrl: "$$product.bannerImageUrl"
                     }
                  }
               }
            }
         }
      ]);

      const existingUser = existingUserArray.length > 0 ? existingUserArray[0] : null;

      if (existingUser) {
         return NextResponse.json(
            {
               message: "User exists",
               data: {
                  userId: existingUser._id,
                  cart: {
                     id: existingUser.cart,
                     products: existingUser.products || []
                  }
               }
            },
            { status: 200 }
         );
      }

      // Create new user
      const newUser = await User.create({
         clerkId,
         email,
         name: fullName,
      });

      if (!newUser) {
         return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         {
            message: "User created successfully",
            user: {
               id: newUser._id,
               cart: {
                  id: null,
                  totalAmount: 0,
                  products: []
               }
            }
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Auth API Error:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}