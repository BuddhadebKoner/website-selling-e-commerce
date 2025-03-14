import mongoose from "mongoose";


export interface IAddress {
   street: string;
   city: string;
   state: string;
   zip: string;
   country: string;
   paymentMethod: string;
   cardNumber: string;
   expirationDate: string;
   cvv: string;
}

const AddressSchema = new mongoose.Schema({
   street: {
      type: String,
   },
   city: {
      type: String,
   },
   state: {
      type: String,
   },
   zip: {
      type: String,
   },
   country: {
      type: String,
   },
   paymentMethod: {
      type: String,
   },
   cardNumber: {
      type: String,
   },
   expirationDate: {
      type: String,
   },
   cvv: {
      type: String,
   },
}, { timestamps: true });

const Address = mongoose.models.Address || mongoose.model<IAddress>("Address", AddressSchema);
export default Address;