'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updatePaymentStatus } from '@/endpoints/order.api';

// Loading component for Suspense fallback
function PaymentStatusLoading() {
  return <div className="p-4 text-center">Loading payment information...</div>;
}

// Component that uses searchParams
function PaymentStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const trackId = searchParams.get('trackId');

  console.log('[PaymentSuccess] Params received:', { amount, trackId });

  const [status, setStatus] = useState<'validating' | 'updating' | 'success' | 'error'>('validating');
  const [error, setError] = useState<string | null>(null);

  // Validate parameters on component mount
  useEffect(() => {
    // Check if both required parameters exist
    if (!trackId) {
      console.error('[PaymentSuccess] Missing trackId parameter');
      setError('Invalid payment session: Missing order information');
      setStatus('error');
      return;
    }

    if (!amount) {
      console.error('[PaymentSuccess] Missing amount parameter');
      setError('Invalid payment session: Missing payment amount');
      setStatus('error');
      return;
    }

    // Validate amount is a number
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      console.error('[PaymentSuccess] Invalid amount:', amount);
      setError('Invalid payment amount');
      setStatus('error');
      return;
    }

    // Parameters are valid, proceed to updating state
    setStatus('updating');
  }, [amount, trackId]);

  // Process payment status update
  useEffect(() => {
    // Only run this effect when status is 'updating'
    if (status !== 'updating') return;

    const updateOrderStatus = async () => {
      console.log('[PaymentSuccess] Starting status update process');

      try {
        console.log('[PaymentSuccess] Updating payment status for trackId:', trackId);
        const amountValue = parseFloat(amount!);
        const result = await updatePaymentStatus(trackId!, amountValue);
        console.log('[PaymentSuccess] API response:', result);

        if (!result.success) {
          throw new Error(result.error || 'Failed to update order status');
        }

        console.log('[PaymentSuccess] Status update successful');
        setStatus('success');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update order status';
        console.error('[PaymentSuccess] Error updating status:', errorMsg);
        setError(errorMsg);
        setStatus('error');
      }
    };

    updateOrderStatus();
  }, [status, amount, trackId]);

  // Validation or initial loading state
  if (status === 'validating') {
    return <div className="p-4 text-center">Validating payment information...</div>;
  }

  // Processing state
  if (status === 'updating') {
    return <div className="p-4 text-center">Processing payment... Please wait.</div>;
  }

  // Error state - invalid parameters or payment update failed
  if (status === 'error') {
    return (
      <div className="p-4 text-center">
        <h2 className="text-red-500">Payment Error</h2>
        <p>{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Return to Home
        </button>
      </div>
    );
  }

  // Success state - only reached if all validations passed and update was successful
  return (
    <div className="p-4 text-center">
      <h2 className="text-green-500">Payment Successful</h2>
      <p>Amount: ₹{parseFloat(amount!).toFixed(2)}</p>
      <p className="text-sm text-gray-500 mb-4">Order ID: {trackId}</p>
      <button
        onClick={() => router.push('/orders')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        View Your Order
      </button>
    </div>
  );
}

// Main page component that wraps the PaymentStatus with Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentStatusLoading />}>
      <PaymentStatus />
    </Suspense>
  );
}