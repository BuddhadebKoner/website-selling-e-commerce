import mongoose from "mongoose";

export interface IRating {
   user: mongoose.Types.ObjectId;
   products: mongoose.Types.ObjectId[];
   rating: number;
   comment: string;
   isFeatured: boolean;
};

const RatingSchema = new mongoose.Schema({
   user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
   },
   products: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Product",
         required: true
      }
   ],
   rating: {
      type: Number,
      required: true
   },
   comment: {
      type: String,
      default: ""
   },
   isFeatured: {
      type: Boolean,
      default: false
   }
}, { timestamps: true });

const Rating = mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);
export default Rating;