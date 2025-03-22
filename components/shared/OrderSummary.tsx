"use client";

import { OrderSummaryProps } from '@/types/interfaces';
import React, { useState } from 'react';

// Format price from cents to dollars
const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

const OrderSummary: React.FC<OrderSummaryProps> = ({
   cartItems,
   subtotal,
   tax,
   total,
   onCheckout,
   isLoading,
   isCheckingOut,
   discountCode,
   discountAmount = 0
}) => {
   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
   const [promoCode, setPromoCode] = useState('');

   const effectiveTotal = total - discountAmount;

   return (
      <div className="bg-box border border-theme rounded-lg overflow-hidden shadow-sm sticky top-24">
         <div className="p-4 border-b border-theme bg-background-secondary">
            <h2 className="font-semibold">Order Summary</h2>
         </div>

         <div className="p-4 space-y-4">
            {/* Products breakdown - collapsible section */}
            <div className="border-b border-theme pb-3">
               <button
                  className="flex justify-between items-center w-full text-left font-medium"
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
               >
                  <span>Order Details ({cartItems.length} items)</span>
                  <svg
                     className={`w-5 h-5 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`}
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
               </button>

               {isDetailsOpen && (
                  <div className="mt-3 space-y-2 pl-2 text-sm">
                     {isLoading ? (
                        <div className="py-2">Loading items...</div>
                     ) : (
                        cartItems.map((item) => (
                           <div key={item._id} className="flex justify-between py-1">
                              <div className="flex-1 pr-2">
                                 <div className="truncate">{item.title}</div>
                                 {item.discountPrice && (
                                    <div className="text-xs text-accent-red">
                                       <span className="line-through text-secondary mr-1">
                                          {formatPrice(item.originalPrice || item.price)}
                                       </span>
                                       {formatPrice(item.discountPrice)}
                                    </div>
                                 )}
                              </div>
                              <div>{formatPrice(item.price)}</div>
                           </div>
                        ))
                     )}
                  </div>
               )}
            </div>

            {/* Promo code section */}
            <div className="border-b border-theme pb-4">
               <form className="flex gap-2" onSubmit={(e) => {
                  e.preventDefault();
                  // Implement promo code logic here
                  alert(`Promo code ${promoCode} applied`);
               }}>
                  <input
                     type="text"
                     placeholder="Promo code"
                     className="flex-1 p-2 text-sm border border-theme rounded bg-background-primary"
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                     type="submit"
                     className="btn btn-secondary text-sm py-1"
                     disabled={!promoCode.trim()}
                  >
                     Apply
                  </button>
               </form>

               {discountCode && (
                  <div className="mt-2 text-sm text-accent-green flex items-center">
                     <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                     <span>
                        Code <strong>{discountCode}</strong> applied: {formatPrice(discountAmount)} off
                     </span>
                  </div>
               )}
            </div>

            {/* Price calculation */}
            <div className="space-y-2">
               <div className="flex justify-between">
                  <span className="text-secondary">Subtotal</span>
                  <span>{isLoading ? 'Loading...' : formatPrice(subtotal)}</span>
               </div>

               <div className="flex justify-between">
                  <span className="text-secondary">Tax (8%)</span>
                  <span>{isLoading ? 'Loading...' : formatPrice(tax)}</span>
               </div>

               {discountAmount > 0 && (
                  <div className="flex justify-between text-accent-green">
                     <span>Discount</span>
                     <span>-{formatPrice(discountAmount)}</span>
                  </div>
               )}

               <div className="border-t border-theme pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-highlight-primary">
                     {isLoading ? 'Loading...' : formatPrice(effectiveTotal)}
                  </span>
               </div>
            </div>

            <button
               className="btn btn-primary w-full py-3"
               onClick={onCheckout}
               disabled={isLoading || isCheckingOut}
            >
               {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <div className="mt-4">
               <p className="text-sm text-secondary mb-2 text-center">We Accept</p>
               <div className="flex justify-center gap-2">
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme"></div>
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme"></div>
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme"></div>
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme"></div>
               </div>
            </div>

            <div className="text-xs text-center text-secondary mt-4 flex items-center justify-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
               </svg>
               <span>Secure Checkout</span>
            </div>
         </div>
      </div>
   );
};

export default OrderSummary;