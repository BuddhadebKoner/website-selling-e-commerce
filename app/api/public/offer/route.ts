import { connectToDatabase } from "@/lib/db";
import Offer from "@/models/offer.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

      const skip = (page - 1) * limit;

      // Get total count for pagination metadata
      const totalCount = await Offer.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      await connectToDatabase();

      const offer = await Offer.find()
         .skip(skip)
         .limit(limit);
      
      if (!offer || offer.length === 0) { 
         return NextResponse.json(
            { error: "No offers found" },
            { status: 404 }
         );
      };

      return NextResponse.json(
         {
            message: "Offers fetched successfully",
            data: offer,
            pagination: {
               currentPage: page,
               totalPages,
               totalItems: totalCount,
               itemsPerPage: limit
            }
         },
         { status: 200 }
      );

   } catch (error) {
      return NextResponse.json(
         { error: "Error in getting offers" },
         { status: 500 }
      );
   }
};