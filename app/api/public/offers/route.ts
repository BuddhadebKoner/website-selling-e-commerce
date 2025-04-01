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

      // Fetch total count for pagination metadata
      const totalOffers = await Product.countDocuments({
         status: "live",
         OfferStatus: "live",
         OfferType: "percentage",
         discount: { $gt: 0 },
         offerStartDate: { $lte: currentDate },
         offerEndDate: { $gte: currentDate },
      });

      // Fetch products with active offers with pagination
      const offers = await Product.find({
         status: "live",
         OfferStatus: "live",
         OfferType: "percentage",
         discount: { $gt: 0 },
         offerStartDate: { $lte: currentDate },
         offerEndDate: { $gte: currentDate },
      })
         .sort({ discount: -1 })
         .skip(skip)
         .limit(limit)
         .select("title price discount offerStartDate offerEndDate slug productType")
         .lean()
         .exec();

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