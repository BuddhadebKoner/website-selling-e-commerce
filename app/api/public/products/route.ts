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

      const products = await Product.find()
         .skip(skip)
         .limit(limit);


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