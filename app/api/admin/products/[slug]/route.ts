import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   context: { params: { slug: string } }
) {
   // the the user is authenticated or not
   const isAdmin = isAdminRequest(request);
   if (!isAdmin) {
      return NextResponse.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }

   try {
      const params = await context.params;
      const { slug } = params;
      
      if (!slug) {
         return NextResponse.json(
            { error: "Product slug is required" },
            { status: 400 }
         );
      }

      const updates = await request.json();
      if (Object.keys(updates).length === 0) {
         return NextResponse.json(
            { error: "No update data provided" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // If status is included, validate it
      if (updates.status) {
         const validateStatus = ["live", "delay", "unavailable"]; // Fixed typo in "unavailable"
         if (!validateStatus.includes(updates.status)) {
            return NextResponse.json(
               { error: "Invalid product status" },
               { status: 400 }
            );
         }
      }

      // Find the product by slug and update it
      const updatedProduct = await Product.findOneAndUpdate(
         { slug },
         { $set: updates },
         { new: true }
      );

      if (!updatedProduct) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         { message: "Product updated successfully", },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
         { error: "Error updating product" },
         { status: 500 }
      );
   }
}
