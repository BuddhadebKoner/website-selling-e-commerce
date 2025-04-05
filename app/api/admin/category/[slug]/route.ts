import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   context: { params: Promise<{ slug: string }> }
) {
   try {
      const isAdmin = isAdminRequest(request);
      if (!isAdmin) {
         return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
         );
      }

      const { params } = context;
      const resolvedParams = await params;
      const { slug } = resolvedParams;

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

      if (updates.isFeatured !== undefined) {
         if (typeof updates.isFeatured === "string") {
            updates.isFeatured = updates.isFeatured === "true";
         }
      }

      if (updates.slug) {
         updates.slug = updates.slug.replace(/\s+/g, "");
      }

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

