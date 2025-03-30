import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

// get products by status using pagination
export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5');
    const status = request.nextUrl.searchParams.get('status');
    const skip = (page - 1) * limit;

    // Validate status parameter is provided
    if (!status) {
      return NextResponse.json(
        { error: "Status parameter is required" },
        { status: 400 }
      );
    }

    // Validate status is one of the enum values
    const validStatuses = ["live", "delay", "unabaliable"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value. Must be one of: live, delay, unabaliable" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get total count for pagination metadata
    const totalCount = await Product.countDocuments({ status });
    const totalPages = Math.ceil(totalCount / limit);

    const products = await Product.find({ status })
      .select("-__v -rating -offer -bannerImageID")
      .skip(skip)
      .limit(limit);

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: `No products found with status: ${status}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Products with status '${status}' fetched successfully`,
        data: products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit
        }
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error in getting products by status" },
      { status: 500 }
    );
  }
}