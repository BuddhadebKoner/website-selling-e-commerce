"use client";

import React from 'react';

interface OrderSummaryProps {
   subtotal: number;
   tax: number;
   total: number;
   onCheckout: () => void;
}

// Format price from cents to dollars
const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, tax, total, onCheckout }) => {
   return (
      <div className="bg-box border border-theme rounded-lg overflow-hidden shadow-sm sticky top-24">
         <div className="p-4 border-b border-theme bg-background-secondary">
            <h2 className="font-semibold">Order Summary</h2>
         </div>
         <div className="p-4 space-y-4">
            <div className="space-y-2">
               <div className="flex justify-between">
                  <span className="text-secondary">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-secondary">Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
               </div>
               <div className="border-t border-theme pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-highlight-primary">{formatPrice(total)}</span>
               </div>
            </div>
            <button className="btn btn-primary w-full py-3" onClick={onCheckout}>
               Proceed to Checkout
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
