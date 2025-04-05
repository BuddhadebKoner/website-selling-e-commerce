import { isAdminRequest } from "@/lib/auth-admin-gard";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   context: { params: Promise<{ slug: string }> }
) {
   try {
      const isAdmin = isAdminRequest(request);
      if (!isAdmin) {
         return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
         );
      }

      const { params } = context;
      const resolvedParams = await params;
      const { slug } = resolvedParams;

      const {
         OfferStatus,
         OfferType,
         discount,
         offerStartDate,
         offerEndDate
      } = await request.json();

      if (!OfferStatus || !OfferType || !discount || !offerStartDate || !offerEndDate) {
         return NextResponse.json(
            { success: false, error: "All offer fields are required" },
            { status: 400 }
         );
      }

      if (!["live", "unavailable"].includes(OfferStatus)) {
         return NextResponse.json(
            { success: false, error: "Invalid offer status. Must be 'live' or 'unavailable'" },
            { status: 400 }
         );
      }

      if (!["percentage", "fixed"].includes(OfferType)) {
         return NextResponse.json(
            { success: false, error: "Invalid offer type. Must be 'percentage' or 'fixed'" },
            { status: 400 }
         );
      }

      if (discount <= 0) {
         return NextResponse.json(
            { success: false, error: "Discount must be greater than zero" },
            { status: 400 }
         );
      }

      if (OfferType === "percentage" && discount > 100) {
         return NextResponse.json(
            { success: false, error: "Percentage discount cannot exceed 100%" },
            { status: 400 }
         );
      }

      const startDate = new Date(offerStartDate);
      const endDate = new Date(offerEndDate);

      if (endDate <= startDate) {
         return NextResponse.json(
            { success: false, error: "End date must be after start date" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      const product = await Product.findOne({ slug: slug });
      if (!product) {
         return NextResponse.json(
            { success: false, error: "Product not found" },
            { status: 404 }
         );
      }

      product.OfferStatus = OfferStatus;
      product.OfferType = OfferType;
      product.discount = discount;
      product.offerStartDate = offerStartDate;
      product.offerEndDate = offerEndDate;

      const updatedProduct = await product.save();
      if (!updatedProduct) {
         return NextResponse.json(
            { success: false, error: "Failed to add offer to product" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         {
            success: true,
            message: "Offer added successfully",
            offer: {
               OfferStatus,
               OfferType,
               discount,
               offerStartDate,
               offerEndDate
            }
         },
         { status: 200 }
      );

   } catch (error) {
      console.error("Server error:", error);
      return NextResponse.json(
         { success: false, error: "Internal Server Error" },
         { status: 500 }
      );
   }
}

export async function GET(
   req: NextRequest,
   context: { params: Promise<{ slug: string }> }
) {
   // Verify admin authentication
   const isAdmin = isAdminRequest(req);
   if (!isAdmin) {
      return NextResponse.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }

   try {
      const { params } = context;
      const resolvedParams = await params;
      const { slug } = resolvedParams;

      if (!slug) {
         return NextResponse.json(
            { error: "Product slug is required" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      const product = await Product.findOne({ slug: slug })
         .select("OfferStatus OfferType discount offerStartDate offerEndDate")
         .lean<{ OfferStatus: string; OfferType: string; discount: number; offerStartDate: string; offerEndDate: string }>()
         .exec();

      // If product not found
      if (!product) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }

      // If offer exists but is unavailable, return 204 No Content
      if (product.OfferStatus === "unavailable") {
         return NextResponse.json(
            { message: "Offer exists but is unavailable" },
            { status: 204 }
         );
      }

      // Format dates for frontend consumption
      const formattedOffer = {
         ...product,
         offerStartDate: product.offerStartDate ? new Date(product.offerStartDate).toISOString().split('T')[0] : null,
         offerEndDate: product.offerEndDate ? new Date(product.offerEndDate).toISOString().split('T')[0] : null,
         productId: slug
      };

      return NextResponse.json(
         { offer: formattedOffer },
         { status: 200 }
      );

   } catch (error) {
      console.error("Server error:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
