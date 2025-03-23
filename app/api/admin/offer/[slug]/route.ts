import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Offer from "@/models/offer.model";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
   request: NextRequest,
   context: { params: { slug: string } }
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

      const params = await context.params;
      const { slug } = params;

      if (!slug) {
         return NextResponse.json(
            { error: "slug is requied" },
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
      if (updates.offerName) {
         updates.offerName = updates.offerName.trim().toUpperCase().replace(/\s/g, "")
      }

      // Find the category by slug and update it
      const updatedCategory = await Offer.findOneAndUpdate(
         { offerName: slug },
         updates,
         { new: true }
      )

      if (!updatedCategory) {
         return NextResponse.json(
            { error: "offer not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         { message: "Offer updated successfully" },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error updating Offer:", error);
      return NextResponse.json(
         { error: "Error updating Offer" },
         { status: 500 }
      );
   }
}

