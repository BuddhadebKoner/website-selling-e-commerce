import mongoose from "mongoose";

export interface iUser {
   clerkId: string;
   role: string;
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
   role: {
      type: String,
      enum: ["master", "member", "admin"],
      default: "member",
   },
   email: {
      type: String,
      required: true,
      unique: true
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