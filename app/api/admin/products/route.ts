import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
   try {
      // Get the update data from request body
      const updateData = await request.json();
      const { slug, ...fieldsToUpdate } = updateData;

      // Check if slug is provided
      if (!slug) {
         return NextResponse.json(
            { error: "Slug is required to identify the product" },
            { status: 400 }
         );
      }

      // Check if there are any fields to update
      if (Object.keys(fieldsToUpdate).length === 0) {
         return NextResponse.json(
            { error: "Please provide at least one field to update" },
            { status: 400 }
         );
      }

      await connectToDatabase();

      // Check if the product exists
      const product = await Product.findOne({ slug });
      if (!product) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }

      // Prepare the update object with type conversions
      const updates: any = {};

      // Handle price conversion if provided
      if (fieldsToUpdate.price !== undefined) {
         const convertedPrice = Number(fieldsToUpdate.price);
         if (isNaN(convertedPrice) || convertedPrice < 0) {
            return NextResponse.json(
               { error: "Price must be a valid positive number" },
               { status: 400 }
            );
         }
         updates.price = convertedPrice;
      }

      // Handle websiteAge conversion if provided
      if (fieldsToUpdate.websiteAge !== undefined) {
         const convertedWebsiteAge = Number(fieldsToUpdate.websiteAge);
         if (isNaN(convertedWebsiteAge) || convertedWebsiteAge < 0) {
            return NextResponse.json(
               { error: "Website Age must be a valid positive number" },
               { status: 400 }
            );
         }
         updates.websiteAge = convertedWebsiteAge;
      }

      // Handle tags conversion if provided
      if (fieldsToUpdate.tags !== undefined) {
         updates.tags = typeof fieldsToUpdate.tags === "string"
            ? fieldsToUpdate.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
            : fieldsToUpdate.tags;
      }

      // Handle technologyStack conversion if provided
      if (fieldsToUpdate.technologyStack !== undefined) {
         updates.technologyStack = typeof fieldsToUpdate.technologyStack === "string"
            ? fieldsToUpdate.technologyStack.split(",").map((tech: string) => tech.trim()).filter(Boolean)
            : fieldsToUpdate.technologyStack;
      }

      // Validate productType if provided
      if (fieldsToUpdate.productType !== undefined) {
         const allowedProductTypes = [
            "E-commerce",
            "Portfolio",
            "Business",
            "Personal Blog",
            "Landing Page",
            "SaaS",
            "Educational",
            "Real Estate",
            "Job Portal",
            "Social Network",
         ];

         if (!allowedProductTypes.includes(fieldsToUpdate.productType)) {
            return NextResponse.json(
               {
                  error: `Invalid productType. Allowed types are: ${allowedProductTypes.join(
                     ", "
                  )}`,
               },
               { status: 400 }
            );
         }
         updates.productType = fieldsToUpdate.productType;
      }

      // Validate images if provided
      if (fieldsToUpdate.images !== undefined) {
         if (!Array.isArray(fieldsToUpdate.images)) {
            return NextResponse.json(
               { error: "Images should be an array of objects" },
               { status: 400 }
            );
         }

         const validatedImages = [];
         for (const img of fieldsToUpdate.images) {
            if (!img.imageUrl || !img.imageId) {
               return NextResponse.json(
                  { error: "Each image must have imageUrl and imageId" },
                  { status: 400 }
               );
            }
            validatedImages.push({
               imageUrl: img.imageUrl,
               imageId: img.imageId,
               _id: img._id // Preserve existing _id if present
            });
         }
         updates.images = validatedImages;
      }

      // Add other fields without conversion
      const directFields = ['title', 'subTitle', 'liveLink', 'productAbout', 'bannerImageUrl', 'bannerImageID'];
      directFields.forEach(field => {
         if (fieldsToUpdate[field] !== undefined) {
            updates[field] = fieldsToUpdate[field];
         }
      });

      // Update the product with only the provided fields
      const updatedProduct = await Product.findOneAndUpdate(
         { slug },
         { $set: updates },
         { new: true }
      );

      return NextResponse.json({
         message: "Product updated successfully",
         data: updatedProduct
      });
   } catch (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}