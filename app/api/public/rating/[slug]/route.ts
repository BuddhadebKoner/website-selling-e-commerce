import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

// get all rating by productId
export async function GET(
   request: NextRequest,
   context: { params: Promise<{ slug: string }> }
) {
   try {
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '3');
      const skip = (page - 1) * limit;

      await connectToDatabase();

      const { params } = context;
      const resolvedParams = await params;
      const { slug } = resolvedParams;

      const isProductExists = await Product.exists({ slug });
      if (!isProductExists) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }
      const ratings = await Product.aggregate([
         { $match: { slug: slug } },
         {
            $lookup: {
               from: "ratings",
               localField: "_id",
               foreignField: "products",
               as: "ratings"
            }
         },
         { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },
         {
            $lookup: {
               from: "users",
               localField: "ratings.user",
               foreignField: "_id",
               as: "userInfo"
            }
         },
         { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
         {
            $project: {
               _id: "$ratings._id",
               userName: "$userInfo.name",
               rating: "$ratings.rating",
               comment: "$ratings.comment",
               createdAt: "$ratings.createdAt"
            }
         },

         { $skip: skip },
         { $limit: limit }
      ]);

      if (!ratings || ratings.length === 0) {
         return NextResponse.json(
            { error: "No ratings found" },
            { status: 404 }
         );
      }

      const totalCount = await Product.aggregate([
         { $match: { slug: slug } },
         {
            $lookup: {
               from: "ratings",
               localField: "_id",
               foreignField: "products",
               as: "ratings"
            }
         },
         { $project: { count: { $size: "$ratings" } } }
      ]);

      const totalRatings = totalCount.length > 0 ? totalCount[0].count : 0;
      const totalPages = Math.ceil(totalRatings / limit);

      return NextResponse.json({
         success: true,
         ratings,
         pagination: {
            currentPage: page,
            totalPages,
            totalRatings,
            limit
         }
      });

   } catch (error) {
      console.error("Error fetching ratings:", error);
      return NextResponse.json(
         { success: false, error: "Internal server error" },
         { status: 500 }
      );
   }
}