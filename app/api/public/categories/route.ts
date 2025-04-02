import { connectToDatabase } from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

// get all products using pagination 
export async function GET(request: NextRequest) {
   try {
      await connectToDatabase();
      
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      // Get total count for pagination metadata
      const totalCount = await Category.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      const categories = await Category.aggregate([
         // First sort by creation date
         { 
            $sort: { createdAt: -1 } 
         },
         // Then skip for pagination
         { 
            $skip: skip 
         },
         // Then limit results
         { 
            $limit: limit 
         },
         // Lookup products to get more details (optional)
         {
            $lookup: {
               from: "products",
               localField: "products",
               foreignField: "_id",
               as: "productDetails"
            }
         },
         // Project only the fields we need
         {
            $project: {
               title: 1,
               subTitle: 1,
               slug: 1,
               isFeatured: 1,
               createdAt: 1,
               productsCount: { $size: "$products" },
            }
         }
      ]);

      if (!categories || categories.length === 0) {
         return NextResponse.json(
            { error: "No category found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: "Categories fetched successfully",
            data: categories,
            pagination: {
               currentPage: page,
               totalPages,
               totalItems: totalCount,
               itemsPerPage: limit
            }
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
         { error: "Error in getting categories" },
         { status: 500 }
      );
   }
}