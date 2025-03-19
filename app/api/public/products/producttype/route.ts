import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

// get products by product type using pagination
export async function GET(request: NextRequest) {
   try {
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
      const productType = request.nextUrl.searchParams.get('type');
      const skip = (page - 1) * limit;

      // Validate productType parameter is provided
      if (!productType) {
         return NextResponse.json(
            { error: "Product type parameter is required" },
            { status: 400 }
         );
      }

      // Validate productType is one of the enum values
      const validProductTypes = [
         "E-commerce",
         "Portfolio",
         "Business",
         "Personal Blog",
         "Landing Page",
         "SaaS",
         "Educational",
         "Real Estate",
         "Job Portal",
         "Social Network"
      ];

      if (!validProductTypes.includes(productType)) {
         return NextResponse.json(
            { error: "Invalid product type value" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Get total count for pagination metadata
      const totalCount = await Product.countDocuments({ productType });
      const totalPages = Math.ceil(totalCount / limit);

      const products = await Product.find({ productType })
         .skip(skip)
         .limit(limit);

      if (!products || products.length === 0) {
         return NextResponse.json(
            { error: `No products found with type: ${productType}` },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: `Products with type '${productType}' fetched successfully`,
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
         { error: "Error in getting products by type" },
         { status: 500 }
      );
   }
}