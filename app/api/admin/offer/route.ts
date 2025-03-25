import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Offer from "@/models/offer.model";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   // the the user is authenticated or not
   const isAdmin = isAdminRequest(request);
   if (!isAdmin) {
      return NextResponse.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }

   try {
      const {
         offerName,
         description,
         status,
         type,
         discount,
         isFeatured,
         offerStartDate,
         offerEndDate,
         products,
      } = await request.json();

      // Validate required fields
      if (!offerName || !description || !status || !type || !discount || !offerStartDate || !offerEndDate || !products) {
         return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
         );
      }

      // Validate isFeatured is a boolean
      if (typeof isFeatured !== "boolean") {
         return NextResponse.json(
            { message: "isFeatured must be a boolean" },
            { status: 400 }
         );
      }

      // check status type is valid 
      const statusEnum = ["active", "inactive", "expired"];
      if (!statusEnum.includes(status)) {
         return NextResponse.json(
            { message: "Enter right status" },
            { status: 400 }
         );
      }

      // check type type is valid "percentage", "fixed"
      const typeEnum = ["percentage", "fixed"];
      if (!typeEnum.includes(type)) {
         return NextResponse.json(
            { message: "Enter right type" },
            { status: 400 }
         );
      }

      // convert it into capital letter with no space
      const processedOfferName = offerName.trim().toUpperCase().replace(/\s/g, "");

      // Ensure products is an array
      if (!Array.isArray(products)) {
         return NextResponse.json(
            { message: "Products must be an array" },
            { status: 400 }
         );
      }

      // offerStartDate is less than offerEndDate
      if (new Date(offerStartDate) > new Date(offerEndDate)) {
         return NextResponse.json(
            { message: "offerStartDate must be less than offerEndDate" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Check for duplicate category slug
      const existingOffer = await Offer.findOne({ offerName: processedOfferName });
      if (existingOffer) {
         return NextResponse.json(
            { message: "this cupon is live, try another" },
            { status: 400 }
         );
      }

      const newOffer = await Offer.create({
         offerName: processedOfferName,
         description,
         status,
         type,
         discount,
         isFeatured,
         offerStartDate,
         offerEndDate,
         products,
      });

      if (!newOffer) {
         return NextResponse.json(
            { message: "Faild to create offer" },
            { status: 500 }
         );
      }

      // update to products offer section

      const updatedProducts = await Product.updateMany(
         { _id: { $in: products } },
         { $set: { offer: newOffer._id } }
      );

      if (!updatedProducts) {
         return NextResponse.json(
            { message: "Faild to update products" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         { message: "Offer created successfully" },
         { status: 201 }
      );

   } catch {
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
