import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const {
         slug,
         title,
         subTitle,
         liveLink,
         productType,
         productAbout,
         tags,
         price,
         websiteAge,
         images,
         bannerImageUrl,
         bannerImageID,
         technologyStack,
      } = await request.json();

      // Basic required fields check
      if (
         !slug ||
         !title ||
         !subTitle ||
         !productType ||
         !productAbout ||
         !tags ||
         !price ||
         !websiteAge ||
         !technologyStack
      ) {
         return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
         );
      }

      // Auto-remove spaces in slug
      const processedSlug = slug.replace(/\s+/g, "");

      // Validate productType against allowed values
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
      if (!allowedProductTypes.includes(productType)) {
         return NextResponse.json(
            {
               error: `Invalid productType. Allowed types are: ${allowedProductTypes.join(
                  ", "
               )}`,
            },
            { status: 400 }
         );
      }

      // Convert price and websiteAge to numbers
      const convertedPrice = Number(price);
      const convertedWebsiteAge = Number(websiteAge);
      if (isNaN(convertedPrice) || convertedPrice < 0) {
         return NextResponse.json(
            { error: "Price must be a valid positive number" },
            { status: 400 }
         );
      }
      if (isNaN(convertedWebsiteAge) || convertedWebsiteAge < 0) {
         return NextResponse.json(
            { error: "Website Age must be a valid positive number" },
            { status: 400 }
         );
      }

      // Convert tags and technologyStack from comma-separated strings to arrays
      const convertedTags =
         typeof tags === "string"
            ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
            : tags;
      const convertedTechStack =
         typeof technologyStack === "string"
            ? technologyStack.split(",").map((tech) => tech.trim()).filter(Boolean)
            : technologyStack;

      // Validate images: if provided, it must be an array of objects with imageUrl and imageId
      let validatedImages = [];
      if (images) {
         if (!Array.isArray(images)) {
            return NextResponse.json(
               { error: "Images should be an array of objects" },
               { status: 400 }
            );
         }
         for (const img of images) {
            if (!img.imageUrl || !img.imageId) {
               return NextResponse.json(
                  { error: "Each image must have imageUrl and imageId" },
                  { status: 400 }
               );
            }
            validatedImages.push({ imageUrl: img.imageUrl, imageId: img.imageId });
         }
      }

      // Check for uniqueness of the processed slug
      const isProductExist = await Product.findOne({ slug: processedSlug });
      if (isProductExist) {
         return NextResponse.json(
            { error: "Slug is already in use. Please use a different slug." },
            { status: 400 }
         );
      }

      // Create the product with converted and processed values
      const res = await Product.create({
         slug: processedSlug,
         title,
         subTitle,
         liveLink,
         productType,
         productAbout,
         tags: convertedTags,
         price: convertedPrice,
         websiteAge: convertedWebsiteAge,
         images: validatedImages,
         bannerImageUrl,
         bannerImageID,
         technologyStack: convertedTechStack,
      });
      if (!res) { 
         return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
         );
      };

      return NextResponse.json(
         { message: "Product created successfully" },
         { status: 201 }
      );
   } catch (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
