import { IOffer } from '@/types/interfaces';
import Link from 'next/link';
import React, { useState } from 'react';

const OfferDataRow = ({ offer }: {
   offer: IOffer;
}) => {

   const [isFeatured, setIsFeatured] = useState(offer.isFeatured);

   const handleIsFeaturedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsFeatured(event.target.checked);
   };

   return (
      <tr key={offer.offerName} className="border-t border-theme hover:bg-background-secondary transition-all">
         <td className="px-4 py-3">
            <div className="font-medium text-primary">{offer.offerName}</div>
         </td>
         <td className="px-4 py-3">
            <div className="text-secondary text-sm">{offer.status}</div>
         </td>
         <td className="px-4 py-3">
            <div className="flex items-center gap-3">
               <label className="relative inline-flex items-center cursor-pointer">
                  <input
                     type="checkbox"
                     checked={isFeatured}
                     onChange={handleIsFeaturedChange}
                     className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-all ${isFeatured ? 'bg-accent-green' : 'bg-background-secondary'} relative border border-theme`}>
                     <span className={`absolute inset-y-0 left-0 bg-foreground w-4 h-4 rounded-full transition-all transform ${isFeatured ? 'translate-x-5' : 'translate-x-1'} my-0.5`}></span>
                  </div>
               </label>
            </div>
         </td>
         <td className="px-4 py-3 text-start font-medium">
            {
               new Date(offer.offerStartDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
               })
            }
         </td>
         <td className="px-4 py-3 text-start font-medium">
            {
               new Date(offer.offerEndDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
               })
            }
         </td>
         <td className='className="px-4 py-3 text-start font-medium"'>
            <Link
               href={`/admin-dashbord/update-offer/${offer.offerName}`}
               className="btn btn-secondary text-sm py-1 px-3"
            >
               Edit
            </Link>
            <button className="btn btn-secondary text-sm py-1 px-3 text-accent-red">
               Delete
            </button>
         </td>
      </tr>
   );
};

export default OfferDataRow;