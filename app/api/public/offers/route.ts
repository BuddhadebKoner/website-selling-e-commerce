import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      // Connect to the database
      await connectToDatabase();

      // Get current date to check for valid offers
      const currentDate = new Date();

      // Fetch products with active offers
      const offers = await Product.find({
         status: "live",
         OfferStatus: "live",
         OfferType: "percentage",
         discount: { $gt: 0 },
         offerStartDate: { $lte: currentDate },
         offerEndDate: { $gte: currentDate },
      })
         .sort({ discount: -1 })
         .limit(10)
         .select("title price discount offerStartDate offerEndDate")  // Only select minimal required fields
         .lean()
         .exec();

      if (!offers || offers.length === 0) {
         return NextResponse.json(
            {
               success: false,
               error: "No active offers found",
               totalOffers: 0
            },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            success: true,
            offers,
            totalOffers: offers.length
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