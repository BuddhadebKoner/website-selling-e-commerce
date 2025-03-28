import mongoose from "mongoose";

export interface IOrder {
   owner: mongoose.Types.ObjectId;
   products: mongoose.Types.ObjectId[];
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
         type: mongoose.Types.ObjectId,
         ref: "Product",
      },
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
      default: "pending",
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