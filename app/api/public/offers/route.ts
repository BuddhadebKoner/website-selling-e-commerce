import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      // Extract pagination parameters from URL
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");

      // Validate pagination parameters
      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
         return NextResponse.json(
            {
               success: false,
               error: "Invalid pagination parameters",
               totalOffers: 0
            },
            { status: 400 }
         );
      }

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Connect to the database
      await connectToDatabase();

      // Get current date to check for valid offers
      const currentDate = new Date();

      // Match criteria for active offers
      const matchCriteria = {
         status: "live",
         OfferStatus: "live",
         OfferType: "percentage",
         discount: { $gt: 0 },
         offerStartDate: { $lte: currentDate },
         offerEndDate: { $gte: currentDate },
      };

      // Get total count using aggregation
      const countResult = await Product.aggregate([
         { $match: matchCriteria },
         { $count: "total" }
      ]);
      
      const totalOffers = countResult.length > 0 ? countResult[0].total : 0;

      // Fetch products with active offers using aggregation pipeline
      const offers = await Product.aggregate([
         // Match active offers
         { $match: matchCriteria },
         // Sort by discount (highest first)
         { $sort: { discount: -1 } },
         // Skip for pagination
         { $skip: skip },
         // Limit results
         { $limit: limit },
         // Project only needed fields
         { 
            $project: {
               _id: 1,
               title: 1,
               price: 1,
               discount: 1,
               offerStartDate: 1,
               offerEndDate: 1,
               slug: 1,
               productType: 1
            }
         }
      ]);

      if (!offers || offers.length === 0) {
         return NextResponse.json(
            {
               success: false,
               error: "No active offers found",
               totalOffers: 0,
               page,
               limit,
               totalPages: 0
            },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            success: true,
            offers,
            totalOffers,
            page,
            limit,
            totalPages: Math.ceil(totalOffers / limit)
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error fetching offers:", error);
      return NextResponse.json(
         {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch offers",
            totalOffers: 0
         },
         { status: 500 }
      );
   }
}