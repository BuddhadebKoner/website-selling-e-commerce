import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

// Optimized product search feature
export async function GET(
   request: NextRequest,
   context: { params: Promise<{ key: string }> }
) {
   try {
      const { params } = context;
      const resolvedParams = await params;
      const { key } = resolvedParams;

      if (!key) {
         return NextResponse.json(
            { error: "Search key is required" },
            { status: 400 }
         );
      }

      // key max length 50
      if (key.length > 50) {
         return NextResponse.json(  
            { error: "Search key is too long" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      const products = await Product.aggregate([
         {
            $match: {
               $or: [
                  { title: { $regex: key, $options: "i" } },
                  { subTitle: { $regex: key, $options: "i" } },
                  { productAbout: { $regex: key, $options: "i" } },
                  { tags: { $regex: key, $options: "i" } },
                  { technologyStack: { $regex: key, $options: "i" } }
               ]
            }
         },
         {
            $lookup: {
               from: "categories",
               localField: "category",
               foreignField: "_id",
               as: "category"
            }
         },
         {
            $unwind: {
               path: "$category",
               preserveNullAndEmptyArrays: true
            }
         },
         {
            $project: {
               rating: 0,
               is_featured: 0,
               bannerImageID: 0,
               images: 0
            }
         },
         {
            $limit: 10
         }
      ]);

      return NextResponse.json(products, { status: 200 });
   } catch (error) {
      console.error("Search error:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}