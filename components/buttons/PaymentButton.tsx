"use client"
import React, { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../Forms/PaymentForm';

const PaymentButton = ({ payableAmount, trackId }: { payableAmount: number, trackId: string }) => {
   // Use state to track modal visibility
   const [showPaymentForm, setShowPaymentForm] = useState(false);
   const [stripePromise, setStripePromise] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false);

   // Load Stripe only once when component mounts
   useEffect(() => {
      const loadStripeInstance = async () => {
         const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
         if (key && !stripePromise) {
            setIsLoading(true);
            try {
               const instance = await loadStripe(key);
               setStripePromise(instance);
            } catch (error) {
               console.error("Failed to load Stripe:", error);
            } finally {
               setIsLoading(false);
            }
         }
      };

      loadStripeInstance();
   }, [stripePromise]);

   const handlePaymentClick = () => {
      if (!stripePromise) {
         alert("Payment system is currently unavailable. Please try again later.");
         return;
      }
      setShowPaymentForm(true);
   };

   const handleClosePaymentForm = () => {
      setShowPaymentForm(false);
   };

   return (
      <>
         <button
            onClick={handlePaymentClick}
            className="btn btn-primary text-xs py-1.5 px-3"
            disabled={isLoading || !stripePromise}
         >
            {isLoading ? "Loading..." : "Complete Payment"}
         </button>

         {showPaymentForm && stripePromise && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-medium">Complete Payment</h3>
                     <button
                        onClick={handleClosePaymentForm}
                        className="text-gray-500 hover:text-gray-700"
                     >
                        &times;
                     </button>
                  </div>

                  <Elements
                     stripe={stripePromise}
                     options={{
                        mode: 'payment',
                        amount: Math.round(payableAmount * 100), // Round to avoid floating point issues
                        currency: 'inr',
                        appearance: {
                           theme: 'stripe',
                        },
                     }}
                  >
                     <PaymentForm
                        trackId={trackId}
                        amount={payableAmount}
                        onSuccess={handleClosePaymentForm}
                     />
                  </Elements>
               </div>
            </div>
         )}
      </>
   );
};

export default PaymentButton;
