"use client";

import { OrderSummaryProps } from '@/types/interfaces';
import React, { useState } from 'react';
import { LoaderCircle, CreditCard, LockIcon } from 'lucide-react';
import { formatPrice } from '@/lib/priceCalculations';

const OrderSummary: React.FC<OrderSummaryProps> = ({
   cartItems,
   subtotal,
   tax,
   total,
   onCheckout,
   isLoading,
   isCheckingOut,
   discountAmount = 0,
}) => {
   const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
                  aria-expanded={isDetailsOpen}
                  aria-controls="order-details"
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
                  <div id="order-details" className="mt-3 space-y-2 pl-2 text-sm">
                     {isLoading ? (
                        <div className="py-2 flex items-center">
                           <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                           Loading items...
                        </div>
                     ) : (
                        cartItems.map((item) => (
                           <div key={item._id} className="flex justify-between py-1">
                              <div className="flex-1 pr-2">
                                 <div className="truncate">{item.title}</div>
                                 {item.discountedPrice !== undefined && item.discountedPrice < item.price && (
                                    <div className="text-xs text-accent-green">
                                       <span className="line-through text-secondary mr-1">
                                          {formatPrice(item.price)}
                                       </span>
                                       {formatPrice(item.discountedPrice)}
                                    </div>
                                 )}
                              </div>
                              <div>{formatPrice(item.discountedPrice !== undefined ? item.discountedPrice : item.price)}</div>
                           </div>
                        ))
                     )}
                  </div>
               )}
            </div>

            {/* Price calculation */}
            <div className="space-y-2">
               {/* Original price total (before discounts) */}
               {discountAmount > 0 && (
                  <div className="flex justify-between text-secondary">
                     <span>Original Price</span>
                     <span>{isLoading ? 'Loading...' : formatPrice(subtotal + discountAmount)}</span>
                  </div>
               )}

               {/* Discount display */}
               {discountAmount > 0 && (
                  <div className="flex justify-between text-accent-green">
                     <span>Total Savings</span>
                     <span>-{formatPrice(discountAmount)}</span>
                  </div>
               )}

               {/* Subtotal (after discounts, before tax) */}
               <div className="flex justify-between">
                  <span className="text-secondary">Subtotal</span>
                  <span>{isLoading ? 'Loading...' : formatPrice(subtotal)}</span>
               </div>

               {/* Tax calculation */}
               <div className="flex justify-between">
                  <span className="text-secondary">Tax (8%)</span>
                  <span>{isLoading ? 'Loading...' : formatPrice(tax)}</span>
               </div>

               {/* Final total to pay */}
               <div className="border-t border-theme pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-highlight-primary">
                     {isLoading ? 'Loading...' : formatPrice(total)}
                  </span>
               </div>
            </div>

            {/* Order date information */}
            <div className="text-sm text-secondary">
               <p>Order date: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
               })}</p>
               <p>Estimated delivery: 1-2 business days after payment</p>
            </div>

            <button
               className="btn btn-primary w-full py-3 flex items-center justify-center"
               onClick={onCheckout}
               disabled={isLoading || isCheckingOut || cartItems.length === 0}
            >
               {isCheckingOut ? (
                  <span className="flex items-center">
                     <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                     Processing...
                  </span>
               ) : (
                  <span className="flex items-center">
                     <CreditCard className="h-4 w-4 mr-2" />
                     Place Order
                  </span>
               )}
            </button>

            <div className="mt-4">
               <p className="text-sm text-secondary mb-2 text-center">We Accept</p>
               <div className="flex justify-center gap-2">
                  {/* Payment method icons - you can replace these with actual icons */}
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme flex items-center justify-center text-xs">Visa</div>
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme flex items-center justify-center text-xs">MC</div>
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme flex items-center justify-center text-xs">Amex</div>
                  <div className="w-10 h-6 bg-background-secondary rounded border border-theme flex items-center justify-center text-xs">PayPal</div>
               </div>
            </div>

            <div className="text-xs text-center text-secondary mt-4 flex items-center justify-center gap-1">
               <LockIcon className="h-3 w-3" />
               <span>Secure Checkout</span>
            </div>
         </div>
      </div>
   );
};

export default OrderSummary;