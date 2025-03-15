import mongoose from "mongoose";

export interface iUser {
   clerkId: string;
   email: string;
   Spent: number;
   address: mongoose.Types.ObjectId;
   oders: mongoose.Types.ObjectId[];
   cart: mongoose.Types.ObjectId[];
};

const userSchema = new mongoose.Schema({
   clerkId: {
      type: String,
      required: true,
      unique: true
   },
   email: {
      type: String,
      required: true,
   },
   Spent: {
      type: Number,
      default: 0,
   },
   address: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
   },
   oders: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Order",
      },
   ],
   cart: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Product",
      },
   ],
});

const User = mongoose.models.User || mongoose.model<iUser>("User", userSchema);
export default User;  