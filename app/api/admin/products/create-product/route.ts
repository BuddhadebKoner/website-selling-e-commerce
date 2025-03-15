import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { slug, title, subTitle, liveLink, productType, productAbout, tags, price, websiteAge, images, bannerImageUrl, bannerImageID, technologyStack} = await request.json();

      if (!slug || !title || !subTitle || !productType || !productAbout || !tags || !price || !websiteAge || !technologyStack) {
         return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
         );
      }

      // check for images , images will be array obj with url and id
      if (images) {
         if (!Array.isArray(images)) {
            return NextResponse.json(
               { error: "Images should be array of objects" },
               { status: 400 }
            );
         }

         for (let i = 0; i < images.length; i++) {
            if (!images[i].imageUrl || !images[i].imageId) {
               return NextResponse.json(
                  { error: "Image should have imageUrl and imageId" },
                  { status: 400 }
               );
            }
         }
      }
      // check slug is unque
      const isProductExist = await Product.findOne({ slug });
      if (isProductExist) {
         return NextResponse.json(
            { error: "Use diff slug this is allready used !" },
            { status: 400 }
         );
      }

      const newProduct = await Product.create({
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
      });

      return NextResponse.json(
         { message: "Product created successfully", data: newProduct },
         { status: 201 }
      );
   } catch (error) {
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}