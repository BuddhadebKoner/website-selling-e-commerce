import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   { params }: { params: { slug: string } }
) {
   try {

      // the the user is authenticated or not
      const isAdmin = isAdminRequest(request);
      if (!isAdmin) {
         return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
         );
      }


      const slug = params.slug;
      if (!slug) {
         return NextResponse.json(
            { error: "Category slug is required" },
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

      // If isFeatured is included, validate it's a boolean or convert from string
      if (updates.isFeatured !== undefined) {
         if (typeof updates.isFeatured === "string") {
            updates.isFeatured = updates.isFeatured === "true";
         }
      }

      // If slug is being updated, remove spaces
      if (updates.slug) {
         updates.slug = updates.slug.replace(/\s+/g, "");
      }

      // Find the category by slug and update it
      const updatedCategory = await Category.findOneAndUpdate(
         { slug },
         { $set: updates },
         { new: true }
      );

      if (!updatedCategory) {
         return NextResponse.json(
            { error: "Category not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         { message: "Category updated successfully" },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
         { error: "Error updating category" },
         { status: 500 }
      );
   }
}