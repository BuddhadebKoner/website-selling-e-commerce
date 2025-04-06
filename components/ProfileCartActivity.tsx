"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { calculateDiscountedPrice } from '@/lib/priceCalculations';

interface CartProduct {
   _id: string;
   title: string;
   price: number;
   bannerImageUrl: string;
   OfferStatus?: string;
   OfferType?: string;
   discount?: number;
   offerStartDate?: string;
   offerEndDate?: string;
}

interface ProfileCartActivityProps {
   cartProducts: CartProduct[] | null | undefined;
}

const ProfileCartActivity = ({ cartProducts }: ProfileCartActivityProps) => {
   const hasProducts = cartProducts && cartProducts.length > 0;

   // Process cart items to calculate discounted prices
   const processCartItems = (items: CartProduct[]) => {
      if (!items || !Array.isArray(items)) return [];

      const currentDate = new Date();

      return items.map(item => {
         const offerStart = item.offerStartDate ? new Date(item.offerStartDate) : null;
         const offerEnd = item.offerEndDate ? new Date(item.offerEndDate) : null;

         const isOfferActive =
            item.OfferStatus === 'live' &&
            offerStart && offerEnd &&
            currentDate >= offerStart &&
            currentDate <= offerEnd &&
            (item.discount || 0) > 0;

         const discountedPrice = isOfferActive
            ? calculateDiscountedPrice(
               item.price,
               item.discount || 0,
               item.OfferType === 'percentage' ? 'percentage' : 'fixed'
            )
            : item.price;

         return {
            ...item,
            discountedPrice,
            isOfferActive
         };
      });
   };

   const processedItems = hasProducts ? processCartItems(cartProducts) : [];

   // Calculate subtotal
   const subtotal = processedItems.reduce((total, item) => total + (item.discountedPrice || item.price), 0);

   return (
      <div className="bg-box rounded-lg border-theme border p-6">
         <h2 className="text-xl font-semibold mb-4 text-primary">Cart Activity</h2>
         <div className="space-y-4">
            {hasProducts ? (
               <div>
                  {processedItems.slice(0, 2).map((item) => (
                     <div key={item._id} className="flex items-center justify-between mb-4 pb-4 border-b border-theme last:border-0">
                        <div className="flex items-center">
                           <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                              <Image
                                 src={item.bannerImageUrl}
                                 alt={item.title}
                                 fill
                                 className="object-cover"
                              />
                           </div>
                           <div>
                              <h3 className="text-primary font-medium line-clamp-1">{item.title}</h3>
                              <div className="flex items-center">
                                 {item.isOfferActive ? (
                                    <>
                                       <p className="text-highlight-primary font-medium">
                                          ${item.discountedPrice?.toFixed(2)}
                                       </p>
                                       <p className="text-secondary line-through ml-2 text-sm">
                                          ${item.price.toFixed(2)}
                                       </p>
                                       <span className="ml-2 bg-highlight-primary/10 text-highlight-primary text-xs px-2 py-0.5 rounded">
                                          {item.discount}% OFF
                                       </span>
                                    </>
                                 ) : (
                                    <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}

                  {processedItems.length > 2 && (
                     <p className="text-secondary text-sm mb-3">
                        {processedItems.length - 2} more item(s) in cart
                     </p>
                  )}

                  <div className="flex justify-between items-center mt-2">
                     <div>
                        <p className="text-primary font-medium">Total: ${subtotal.toFixed(2)}</p>
                        <p className="text-secondary text-sm">{processedItems.length} item(s) ready for checkout</p>
                     </div>
                     <Link href="/cart" className="btn btn-primary">
                        View Cart
                     </Link>
                  </div>
               </div>
            ) : (
               <>
                  <div className="flex items-center">
                     <div className="bg-background-secondary rounded-full p-2 mr-4">
                        <ShoppingCart className="w-5 h-5 text-highlight-primary" />
                     </div>
                     <div>
                        <p className="text-primary font-medium">Your cart is empty</p>
                        <p className="text-secondary text-sm">Browse our collection and find something you like!</p>
                     </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                     <Link href="/templates" className="btn btn-primary">
                        Browse Products
                     </Link>
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

export default ProfileCartActivity;