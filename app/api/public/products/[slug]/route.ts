import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
   try {
      await connectToDatabase();
      const { slug } = params;

      console.log("slug", slug);

      if (!slug) {
         return NextResponse.json(
            { error: "Slug is required" },
            { status: 400 }
         );
      }

      const product = await Product.findOne({ slug })
         .sort({ createdAt: -1 });

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
