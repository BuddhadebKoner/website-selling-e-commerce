import { connectToDatabase } from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
   try {
      await connectToDatabase();
      const { slug } = params;

      console.log("slug", slug);

      if (!slug) {
         return NextResponse.json(
            { error: "Slug is required" },
            { status: 400 }
         );
      }

      const category = await Category.findOne({ slug })
         .select("slug title subTitle description bannerImageUrl bannerImageID isFeatured products")
         .sort({ createdAt: -1 });

      if (!category) {
         return NextResponse.json(
            { error: "category not found!" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         { message: "Category found successfully!", category },
         { status: 200 }
      );

   } catch (error) {
      console.error("Error fetching Category:", error);
      return NextResponse.json(
         { error: "Internal Server Error!" },
         { status: 500 }
      );
   }
}
