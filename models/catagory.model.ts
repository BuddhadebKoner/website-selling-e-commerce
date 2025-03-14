import mongoose from "mongoose";

export interface ICategory {
   title: string;
   subTitle: string;
   slug: string;
   description: string;
   bannerImageUrl: string;
   bannerImageID: string;
   isFeatured: boolean;
   products: mongoose.Types.ObjectId[];
};

const CategorySchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   subTitle: {
      type: String,
      required: true
   },
   slug: {
      type: String,
      required: true,
      unique: true
   },
   description: {
      type: String,
      required: true
   },
   bannerImageUrl: {
      type: String,
      required: true
   },
   bannerImageID: {
      type: String,
      required: true
   },
   isFeatured: {
      type: Boolean,
      default: false
   },
   products: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Product",
      },
   ],
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export default Category;