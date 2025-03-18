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
      const { id, status } = await request.json();

      if (!id || !status) {
         return NextResponse.json(
            { error: "Please provide product id and status" },
            { status: 400 }
         );
      }

      const validateStatus = [
         "live",
         "delay",
         "unabaliable"
      ];

      if (!validateStatus.includes(status)) {
         return NextResponse.json(
            { error: "Invalid product status" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Update product status
      const updatedProduct = await Product.findByIdAndUpdate(
         id,
         { status },
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
            message: "Product status updated successfully",
         },
         { status: 200 }
      );
   } catch (error) {
      return NextResponse.json(
         { error: "Error in updating product status" },
         { status: 500 }
      );
   }
}