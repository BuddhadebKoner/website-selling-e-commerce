"use client"
import React, { useState, useEffect } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface PaymentFormProps {
   amount: number;
   orderId?: string;
   onSuccess?: () => void;
   trackId?: string;
}

const PaymentForm = ({ amount, orderId, onSuccess, trackId }: PaymentFormProps) => {
   const stripe = useStripe();
   const elements = useElements();

   const [error, setError] = useState<string | null>(null);
   const [processing, setProcessing] = useState<boolean>(false);
   const [succeeded, setSucceeded] = useState<boolean>(false);
   const [clientSecret, setClientSecret] = useState<string | null>(null);

   useEffect(() => {
      // Create payment intent when component mounts
      const createPaymentIntent = async () => {
         try {
            const response = await fetch('/api/create-payment-intent', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  amount: Math.round(amount * 100),
                  orderId
               }),
            });

            if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.error || 'Failed to create payment intent');
            }

            const data = await response.json();
            setClientSecret(data.clientSecret);
         } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
         }
      };

      if (amount > 0) {
         createPaymentIntent();
      }
   }, [amount, orderId]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setProcessing(true);
      setError(null);

      if (!stripe || !elements || !clientSecret) {
         setProcessing(false);
         return;
      }

      try {
         const { error: submitError } = await elements.submit();
         if (submitError) {
            setError(submitError.message || 'An unknown error occurred');
            setProcessing(false);
            return;
         }

         const returnUrl = `${window.location.origin}/payment-success?amount=${amount}&trackId=${trackId}`

         const { error } = await stripe.confirmPayment({
            elements,
            clientSecret: clientSecret,
            confirmParams: {
               return_url: returnUrl,
            },
         });

         if (error) {
            setError(error.message || 'Payment failed');
         } else {
            setSucceeded(true);
            if (onSuccess) {
               onSuccess();
            }
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Payment processing failed');
      } finally {
         setProcessing(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
               {error}
            </div>
         )}

         {succeeded ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
               Payment successful! Processing your order...
            </div>
         ) : (
            <>
               <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Amount: ₹{amount.toFixed(2)}</p>
                  {clientSecret && <PaymentElement />}
               </div>
               <button
                  type="submit"
                  disabled={processing || !stripe || !elements || !clientSecret}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {processing ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
               </button>
            </>
         )}
      </form>
   );
};

export default PaymentForm;