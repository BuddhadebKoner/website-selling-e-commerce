import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      await connectToDatabase();

      const totalCount = await Product.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      // Using aggregation pipeline instead of simple find()
      const products = await Product.aggregate([
         // Match stage - you can add filtering conditions here
         { $match: {} },

         // Example lookup to join with categories (modify based on your schema)
         {
            $lookup: {
               from: "categories",
               localField: "categoryId",
               foreignField: "_id",
               as: "category"
            }
         },
         {
            $addFields: {
               productsData: {
                  $map: {
                     input: "$productsData",
                     as: "product",
                     in: {
                        $mergeObjects: [
                           "$$product",
                           {
                              ratingCount: { $size: { $ifNull: ["$rating", []] } },
                              rating: "$$REMOVE"
                           }
                        ]
                     }
                  }
               }
            }
         },

         // Optional: transform category from array to object
         { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

         // Pagination
         { $skip: skip },
         { $limit: limit }
      ]);

      if (!products || products.length === 0) {
         return NextResponse.json(
            { error: "No products found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: "Products fetched successfully",
            data: products,
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
      console.error("Error fetching products:", error);
      return NextResponse.json(
         { error: "Error in getting products" },
         { status: 500 }
      );
   }
}