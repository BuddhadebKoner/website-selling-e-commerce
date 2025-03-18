import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/category.model";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   // the the user is authenticated or not
   const isAdmin = isAdminRequest(request);
   if (!isAdmin) {
      return NextResponse.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }

   try {
      const {
         slug,
         title,
         subTitle,
         description,
         bannerImageUrl,
         bannerImageID,
         isFeatured,
         products,
      } = await request.json();

      // Validate required fields
      if (!slug || !title || !subTitle || !description || !bannerImageUrl || !bannerImageID || !products) {
         return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
         );
      }

      // Validate isFeatured is a boolean
      if (typeof isFeatured !== "boolean") {
         return NextResponse.json(
            { error: "isFeatured must be a boolean" },
            { status: 400 }
         );
      }

      // Remove spaces from slug
      const processedSlug = slug.replace(/\s+/g, "");

      await connectToDatabase();

      // Ensure products is an array
      if (!Array.isArray(products)) {
         return NextResponse.json(
            { error: "Products must be an array" },
            { status: 400 }
         );
      }

      // Check for duplicate category slug
      const existingCategory = await Category.findOne({ slug: processedSlug });
      if (existingCategory) {
         return NextResponse.json(
            { error: "Category with this slug already exists" },
            { status: 400 }
         );
      }

      // Validate that all provided product IDs exist in the database
      const productIds = products;
      const foundProducts = await Product.find({ _id: { $in: productIds } });
      if (foundProducts.length !== productIds.length) {
         return NextResponse.json(
            { error: "One or more products do not exist" },
            { status: 400 }
         );
      }

      // Create the new category
      await Category.create({
         slug: processedSlug,
         title,
         subTitle,
         description,
         bannerImageUrl,
         bannerImageID,
         isFeatured,
         products,
      });

      return NextResponse.json(
         { message: "Category created successfully" },
         { status: 201 }
      );
   } catch (error) {
      console.error("Error creating category:", error);
      // Return detailed error messages in development mode only.
      const message =
         process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Internal Server Error";
      return NextResponse.json(
         { error: message },
         { status: 500 }
      );
   }
}
