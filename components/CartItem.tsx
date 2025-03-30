"use client";

import { ProcessedCartItem } from '@/types/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { formatPrice } from '@/lib/priceCalculations';

interface CartItemProps {
   item: ProcessedCartItem;
   isRemoving: boolean;
   onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, isRemoving, onRemove }) => {
   // Determine if there's an active discount
   const hasDiscount = item.isOfferActive && item.discountedPrice !== undefined && item.discountedPrice < item.price;

   // Determine the display price (either discounted or original)
   const displayPrice = hasDiscount ? item.discountedPrice : item.price;

   return (
      <div className="p-4 flex items-start hover:bg-background-secondary transition-all">
         {/* Product Image */}
         <div className="w-24 h-24 flex-shrink-0 mr-4 rounded-md overflow-hidden bg-background-secondary relative">
            {item.bannerImageUrl ? (
               <Image
                  src={item.bannerImageUrl}
                  alt={item.title}
                  width={96}
                  height={96}
                  className="object-cover"
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center bg-background-secondary">
                  <span className="text-4xl text-secondary">?</span>
               </div>
            )}
         </div>

         {/* Product Details */}
         <div className="flex-grow">
            <Link href={`/templates/${item._id}`} className="hover:underline">
               <h3 className="font-medium">{item.title}</h3>
            </Link>

            {/* Price with discount if applicable */}
            {hasDiscount ? (
               <div className="flex items-center">
                  <p className="text-highlight-primary font-bold">{formatPrice(displayPrice!)}</p>
                  <p className="text-secondary text-sm line-through ml-2">{formatPrice(item.price)}</p>
                  <span className="ml-2 text-xs bg-accent-green text-white px-1.5 py-0.5 rounded">
                     {item.OfferType === 'percentage'
                        ? `${item.discount}% OFF`
                        : `${formatPrice(item.discount)} OFF`}
                  </span>
               </div>
            ) : (
               <p className="text-highlight-primary font-bold">{formatPrice(item.price)}</p>
            )}

            <p className="text-sm text-secondary">
               {item.isOfferActive ? 'Offer Active' : 'Template'}
            </p>
         </div>

         {/* Remove Button */}
         <button
            onClick={() => onRemove(item._id)}
            disabled={isRemoving}
            className={`btn btn-secondary px-3 py-1 text-sm ${isRemoving ? 'opacity-50' : ''}`}
            aria-label="Remove item from cart"
         >
            {isRemoving ? (
               <span className="flex items-center">
                  <LoaderCircle className="animate-spin h-3 w-3 mr-1" />
                  Removing...
               </span>
            ) : (
               "Remove"
            )}
         </button>
      </div>
   );
};

export default CartItem;