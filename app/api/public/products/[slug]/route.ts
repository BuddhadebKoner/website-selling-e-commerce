import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   request: NextRequest,
   context: { params: Promise<{ slug: string }> }
) {
   try {
      await connectToDatabase();
      const { params } = context;
      const resolvedParams = await params;
      const { slug } = resolvedParams;

      if (!slug) {
         return NextResponse.json(
            { error: "Slug is required" },
            { status: 400 }
         );
      }

      // Using aggregation pipeline instead of findOne
      const productAggregate = await Product.aggregate([
         // Match the product by slug
         { $match: { slug: slug } },

         // Lookup related categories - fixed to match your schema (category, not categoryId)
         {
            $lookup: {
               from: "categories",
               localField: "category",
               foreignField: "_id",
               as: "categoryDetails"
            }
         },
         // Unwind category for easier access (returns first matched category)
         {
            $unwind: {
               path: "$categoryDetails",
               preserveNullAndEmptyArrays: true
            }
         },

         // Lookup related ratings from your schema
         {
            $lookup: {
               from: "ratings",
               localField: "rating",
               foreignField: "_id",
               as: "ratingDetails"
            }
         },

         // Lookup reviews
         {
            $lookup: {
               from: "reviews",
               localField: "_id",
               foreignField: "productId",
               as: "reviews"
            }
         },

         // Add computed fields
         {
            $addFields: {
               averageRating: {
                  $cond: {
                     if: { $gt: [{ $size: "$ratingDetails" }, 0] },
                     then: { $avg: "$ratingDetails.rating" },
                     else: 0
                  }
               },
               finalPrice: {
                  $cond: {
                     if: { $eq: ["$OfferStatus", "live"] },
                     then: {
                        $cond: {
                           if: { $eq: ["$OfferType", "percentage"] },
                           then: {
                              $subtract: ["$price", { $multiply: ["$price", { $divide: ["$discount", 100] }] }]
                           },
                           else: { $subtract: ["$price", "$discount"] }
                        }
                     },
                     else: "$price"
                  }
               },
               // Check if offer is valid based on dates
               isOfferValid: {
                  $and: [
                     { $eq: ["$OfferStatus", "live"] },
                     { $lte: ["$offerStartDate", new Date()] },
                     { $gte: ["$offerEndDate", new Date()] }
                  ]
               }
            }
         },

         // Project fields to shape the response
         {
            $project: {
               _id: 1,
               slug: 1,
               title: 1,
               subTitle: 1,
               liveLink: 1,
               productType: 1,
               productAbout: 1,
               tags: 1,
               price: 1,
               finalPrice: 1,
               websiteAge: 1,
               status: 1,
               images: 1,
               bannerImageUrl: 1,
               bannerImageID: 1,
               technologyStack: 1,
               is_featured: 1,
               totalSold: 1,
               totalRating: 1,
               category: 1,
               categoryDetails: 1,
               OfferStatus: 1,
               OfferType: 1,
               discount: 1,
               offerStartDate: 1,
               offerEndDate: 1,
               isOfferValid: 1,
               createdAt: 1,
               updatedAt: 1
            }
         }
      ]);

      const product = productAggregate[0] || null;

      if (!product) {
         return NextResponse.json(
            { error: "Product not found!" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         { message: "Product found successfully!", product },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
         { error: "Internal Server Error!" },
         { status: 500 }
      );
   }
}