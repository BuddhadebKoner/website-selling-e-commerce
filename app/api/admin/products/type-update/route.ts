import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
   // the the user is authenticated or not
   const isAdmin = isAdminRequest(request);
   if (!isAdmin) {
      return NextResponse.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }

   try {
      const { id, productType } = await request.json();

      if (!id || !productType) {
         return NextResponse.json(
            { error: "Please provide product id and productType" },
            { status: 400 }
         );
      }

      const validateProductType = [
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

      if (!validateProductType.includes(productType)) {
         return NextResponse.json(
            { error: "Invalid product type" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Update product status
      const updatedProduct = await Product.findByIdAndUpdate(
         id,
         { productType },
         { new: true }
      );

      if (!updatedProduct) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: "Product Type updated successfully",
         },
         { status: 200 }
      );
   } catch (error) {
      return NextResponse.json(
         { error: "Error in updating product Type" },
         { status: 500 }
      );
   }
}