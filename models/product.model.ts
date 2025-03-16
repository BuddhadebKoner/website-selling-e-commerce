import mongoose from "mongoose";

export interface IProduct {
   slug: string;
   title: string;
   subTitle: string;
   liveLink: string;
   productType: string;
   productAbout: string;
   tags: string[];
   price: number;
   websiteAge: number;
   status: string;
   images: {
      imageUrl: string;
      imageId: string;
   }[];
   bannerImageUrl: string;
   bannerImageID: string;
   technologyStack: string[];
   is_featured: boolean;
   totalSold: number;
   category: mongoose.Types.ObjectId;
   rating: mongoose.Types.ObjectId[];
   offer: mongoose.Types.ObjectId[];
}

const ProductSchema = new mongoose.Schema({
   slug: {
      type: String,
      required: true,
      unique: true
   },
   title: {
      type: String,
      required: true
   },
   subTitle: {
      type: String,
      required: true
   },
   liveLink: {
      type: String,
   },
   productType: {
      type: String,
      enum: [
         "E-commerce",
         "Portfolio",
         "Business",
         "Personal Blog",
         "Landing Page",
         "SaaS",
         "Educational",
         "Real Estate",
         "Job Portal",
         "Social Network"
      ],
      required: true
   },
   productAbout: {
      type: String,
      required: true
   },
   tags: {
      type: [String],
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   websiteAge: {
      type: Number,
      required: true
   },
   status: {
      type: String,
      enum: ["live", "delay", "unabaliable"],
      default: "unabaliable",
      required: true,
   },
   images: [
      {
         imageUrl: {
            type: String,
            required: true,
         },
         imageId: {
            type: String,
            required: true,
         },
      }
   ],
   bannerImageUrl: {
      type: String,
      default: "",
      required: true,
   },
   bannerImageID: {
      type: String,
      default: "",
      required: true,
   },
   technologyStack: {
      type: [String],
      required: true,
   },
   is_featured: {
      type: Boolean,
      default: false
   },
   totalSold: {
      type: Number,
      default: 0,
      required: true,
   },
   category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
   },
   rating: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Rating",
      },
   ],
   offer: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Offer",
      },
   ]
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;