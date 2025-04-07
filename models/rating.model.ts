import mongoose from "mongoose";

export interface IRating {
   user: mongoose.Types.ObjectId;
   products: mongoose.Types.ObjectId;
   order: mongoose.Types.ObjectId; 
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
   products: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true
   },
   order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true
   },
   rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
   },
   comment: {
      type: String,
      default: "",
      maxlength: 500
   },
   isFeatured: {
      type: Boolean,
      default: false
   }
}, { timestamps: true });

RatingSchema.index({ user: 1, products: 1, order: 1 }, { unique: true });

const Rating = mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);
export default Rating;