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
   images: string[];
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
      enum: ["live", "delay", "sold", "pending"],
      default: "pending",
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
      default: ""
   },
   bannerImageID: {
      type: String,
      default: ""
   },
   technologyStack: {
      type: [String],
   },
   is_featured: {
      type: Boolean,
      default: false
   },
   totalSold: {
      type: Number,
      default: 0,
   },
   category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true
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