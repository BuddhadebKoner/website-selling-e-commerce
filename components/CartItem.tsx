"use client";

import { CartProduct } from '@/types/interfaces';
import Image from 'next/image';
import React from 'react';


interface CartItemProps {
   item: CartProduct;
   isRemoving: boolean;
   onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, isRemoving, onRemove }) => {
   // Format price from cents to dollars
   const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

   return (
      <div className="p-4 flex items-center hover:bg-background-secondary transition-all">
         <div className="w-24 h-24 flex-shrink-0 mr-4 rounded-md overflow-hidden bg-background-secondary relative">
            {item.bannerImageUrl && !item.bannerImageUrl.includes("localhost") ? (
               <Image
                  src={item.bannerImageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center bg-background-secondary">
                  <span className="text-4xl text-secondary">?</span>
               </div>
            )}
         </div>
         <div className="flex-grow">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-highlight-primary font-bold">{formatPrice(item.price)}</p>
            <p className="text-sm text-secondary">Template</p>
         </div>
         <button
            onClick={() => onRemove(item._id)}
            disabled={isRemoving}
            className="btn btn-secondary px-3 py-1 text-sm"
         >
            {isRemoving ? "Removing..." : "Remove"}
         </button>
      </div>
   );
};

export default CartItem;
