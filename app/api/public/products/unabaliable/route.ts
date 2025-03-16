import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

// Get products with "unabaliable" status using pagination
export async function GET(request: NextRequest) {
   try {
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      // Get total count for pagination metadata (only for unavailable products)
      const totalCount = await Product.countDocuments({ status: "unabaliable" });
      const totalPages = Math.ceil(totalCount / limit);

      const products = await Product.find({ status: "unabaliable" })
         .select("title productType status price")
         .skip(skip)
         .limit(limit);

      if (!products || products.length === 0) {
         return NextResponse.json(
            { error: "No unavailable products found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: "Unavailable products fetched successfully",
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
      return NextResponse.json(
         { error: "Error in getting unavailable products" },
         { status: 500 }
      );
   }
}