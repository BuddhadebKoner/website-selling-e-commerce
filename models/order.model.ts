import mongoose from "mongoose";

export interface IOrder {
   owner: mongoose.Types.ObjectId;
   products: {
      productId: mongoose.Types.ObjectId; 
      title: string;
      productType: string;
      price: number;
      OfferStatus: string;
      OfferType: string;
      discount: number;
   }[];
   totalOriginalAmount: number;
   payableAmount: number;
   discountAmount: number;
   taxAmount: number;
   subtotal: number;
   status: string;
   paymentStatus: string;
   orderDate: Date;
   paymentDate: Date;
   deliveryDate: Date;
   trackId: string;
   invoiceId: string;
   customerNote: string;
};

const OrderSchema = new mongoose.Schema({
   owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
   },
   products: [
      {
         productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
         },
         title: {
            type: String,
            required: true,
         },
         productType: {
            type: String,
            enum: [
               "E-commerce",
               "Portfolio",
               "Business",
               "Personal-Blog",
               "Landing-Page",
               "SaaS",
               "Educational",
               "Real-Estate",
               "Job-Portal",
               "Social-Network"
            ],
            required: true
         },
         price: {
            type: Number,
            required: true
         },
         OfferStatus: {
            type: String,
            enum: ["live", "unabaliable"],
            default: "unabaliable",
         },
         OfferType: {
            type: String,
            enum: ["percentage", "fixed"],
            default: "percentage",
         },
         discount: {
            type: Number,
            default: 0,
         },
      }
   ],
   totalOriginalAmount: {
      type: Number,
      required: true,
   },
   payableAmount: {
      type: Number,
      required: true,
   },
   discountAmount: {
      type: Number,
      required: true,
   },
   taxAmount: {
      type: Number,
      required: true,
   },
   subtotal: {
      type: Number,
      required: true,
   },
   status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "processing",
   },
   paymentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
   },
   orderDate: {
      type: Date,
      default: Date.now
   },
   paymentDate: {
      type: Date,
   },
   deliveryDate: {
      type: Date,
   },
   trackId: {
      type: String,
      required: true,
      unique: true,
   },
   invoiceId: {
      type: String,
   },
   customerNote: {
      type: String,
   },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;