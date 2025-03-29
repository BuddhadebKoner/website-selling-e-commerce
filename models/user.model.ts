import mongoose from "mongoose";

export interface iUser {
   clerkId: string;
   email: string;
   spent: number;
   address: mongoose.Types.ObjectId;
   orders: mongoose.Types.ObjectId[];
   cart: mongoose.Types.ObjectId;
};

const userSchema = new mongoose.Schema({
   clerkId: {
      type: String,
      required: true,
      unique: true
   },
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   spent: {
      type: Number,
      default: 0,
   },
   address: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
   },
   orders: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Order",
      },
   ],
   cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
   }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<iUser>("User", userSchema);
export default User;