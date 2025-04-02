import { connectToDatabase } from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: { slug: string } }) {
   try {
      await connectToDatabase();
      const params = await context.params;
      const { slug } = params;

      console.log("slug", slug);

      if (!slug) {
         return NextResponse.json(
            { error: "Slug is required" },
            { status: 400 }
         );
      }

      const categories = await Category.aggregate([
         // Match the category by slug
         {
            $match: { slug: slug }
         },
         // Lookup products (assuming products is an array of references)
         {
            $lookup: {
               from: "products",
               localField: "products",
               foreignField: "_id",
               as: "productsData"
            }
         },
         // Project only the fields we need
         {
            $project: {
               slug: 1,
               title: 1,
               subTitle: 1,
               description: 1,
               bannerImageUrl: 1,
               bannerImageID: 1,
               isFeatured: 1,
               products: 1,
               productsData: 1,
               _id: 1
            }
         },
         // Sort by creation date
         {
            $sort: { createdAt: -1 }
         },
         // Limit to one result
         {
            $limit: 1
         }
      ]);

      const category = categories[0];

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
