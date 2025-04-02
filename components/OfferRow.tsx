import React from 'react';
import { Trash2 } from 'lucide-react';

interface OfferRowProps {
   offer: {
      _id: string;
      slug: string;
      title: string;
      productType: string;
      price: number;
      discount: number;
      offerStartDate: string;
      offerEndDate: string;
   };
   onDelete: (id: string) => void;
}

const OfferRow = ({ offer, onDelete }: OfferRowProps) => {
   // Calculate final price after discount
   const discountAmount = (offer.price * offer.discount) / 100;
   const finalPrice = offer.price - discountAmount;

   return (
      <tr key={offer._id} className="border-t border-theme hover:bg-background-secondary/30 transition-colors">
         <td className="px-4 py-3 font-medium">{offer.productType}</td>
         <td className="px-4 py-3">{offer.discount}%</td>
         <td className="px-4 py-3 text-secondary line-through">₹{offer.price.toFixed(2)}</td>
         <td className="px-4 py-3 font-medium text-accent-green">₹{finalPrice.toFixed(2)}</td>
         <td className="px-4 py-3">
            <button
               onClick={() => onDelete(offer._id)}
               className="p-2 text-accent-red hover:bg-background-secondary rounded-full transition-colors"
               aria-label="Delete offer"
            >
               <Trash2 size={16} />
            </button>
         </td>
      </tr>
   );
};

export default OfferRow;