import mongoose from "mongoose";

export interface ICart {
   user: mongoose.Types.ObjectId;
   products: mongoose.Types.ObjectId[];
   totalAmount: number;
   cartCreatedAt: Date;
};

const CartSchema = new mongoose.Schema({
   user: {
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
   totalAmount: {
      type: Number,
      required: true
   },
   cartCreatedAt: {
      type: Date,
      default: Date.now
   }
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
export default Cart;