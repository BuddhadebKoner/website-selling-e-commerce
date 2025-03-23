import mongoose from "mongoose";

export interface IOffer {
   offerName: string;
   description: string;
   status: string;
   type: string;
   discount: Number;
   isFeatured: boolean;
   offerStartDate: Date;
   offerEndDate: Date;
   products: mongoose.Types.ObjectId[];
};

const OfferSchema = new mongoose.Schema({
   offerName: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "inactive",
   },
   type: {
      type: String,  
      enum: ["percentage", "fixed"],
      required: true
   },
   discount: {
      type: Number,
      required: true
   },
   isFeatured: {
      type: Boolean,
      required: true
   },
   offerStartDate: {
      type: Date,
      required: true
   },
   offerEndDate: {
      type: Date,
      required: true
   },
   products: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Product",
      },
   ],
}, { timestamps: true });

const Offer = mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
export default Offer;