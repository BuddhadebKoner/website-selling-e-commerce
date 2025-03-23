import { connectToDatabase } from "@/lib/db";
import Offer from "@/models/offer.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, context: { params: { slug: string } }) {
   try {
      await connectToDatabase();
      const params = await context.params;
      const { slug } = params;

      if (!slug) {
         return NextResponse.json(
            { error: "Slug is required" },
            { status: 400 }
         );
      }

      const offer = await Offer.findOne({ offerName: slug })
         .exec();

      if (!offer) {
         return NextResponse.json(
            { error: "Offer not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(
         { message: "Offer fetched successfully", offer },
         { status: 200, }
      );

   } catch (error) {
      console.error("Error fetching Category:", error);
      return NextResponse.json(
         { error: "Internal Server Error!" },
         { status: 500 }
      );
   }
}
