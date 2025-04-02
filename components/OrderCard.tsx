"use client";

import React, { useEffect, useState } from 'react';
import { Order } from '@/types/interfaces';

interface OrderCardProps {
   order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
   const [validatedOrder, setValidatedOrder] = useState<Order | null>(null);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      // Validate the order data
      if (!order) {
         setError("Order data is missing");
         return;
      }

      const validStatuses = ["pending", "processing", "completed", "cancelled"];
      if (!validStatuses.includes(order.status)) {
         setError(`Invalid order status: ${order.status}`);
         return;
      }

      if (!validStatuses.includes(order.paymentStatus)) {
         setError(`Invalid payment status: ${order.paymentStatus}`);
         return;
      }

      setValidatedOrder(order);
      setError(null);
   }, [order]);

   const handlePayment = () => {
      // Handle payment logic
      console.log("Payment processing...");
   };

   const handleCancel = () => {
      // Handle order cancel logic
      console.log("Order cancelled.");
   };

   // Format date with time
   const formatDateTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      });
   };

   const getStatusColor = (status: Order['status']): string => {
      switch (status) {
         case 'pending': return 'bg-accent-yellow';
         case 'processing': return 'bg-accent-orange';
         case 'completed': return 'bg-accent-green';
         case 'cancelled': return 'bg-accent-red';
         default: return 'bg-gray-400';
      }
   };

   const statusLabels: Record<Order['status'], string> = {
      pending: 'Waiting for payment',
      processing: 'Order in progress',
      completed: 'Order delivered',
      cancelled: 'Order cancelled'
   };

   const paymentStatusLabels: Record<Order['status'], string> = {
      pending: 'Not paid',
      processing: 'Processing payment',
      completed: 'Completed',
      cancelled: 'Payment cancelled'
   };

   // If there's an error or no validated order, show error state
   if (error || !validatedOrder) {
      return (
         <div className="card p-4 border border-accent-red">
            <p className="text-accent-red">{error || "Unable to display order"}</p>
         </div>
      );
   }

   return (
      <div className="card p-4 transition-all shadow-sm hover:shadow-md border-l-4"
         style={{ borderLeftColor: `var(--accent-${validatedOrder.status === 'completed' ? 'green' : validatedOrder.status === 'pending' ? 'yellow' : validatedOrder.status === 'processing' ? 'orange' : 'red'})` }}>
         {/* First row - Tracking ID, Order Date, Products */}
         <div className="flex flex-wrap justify-between items-start mb-4">
            <div className="w-full sm:w-auto mb-3 sm:mb-0">
               <span className="text-xs text-secondary uppercase tracking-wider">Tracking ID</span>
               <h3 className="font-medium text-primary text-sm mt-1">{validatedOrder.trackId}</h3>
            </div>

            <div className="w-1/2 sm:w-auto mb-3 sm:mb-0">
               <span className="text-xs text-secondary uppercase tracking-wider">Order Date & Time</span>
               <p className="font-medium text-sm mt-1">{formatDateTime(validatedOrder.orderDate)}</p>
            </div>

            <div className="w-1/2 sm:w-auto">
               <span className="text-xs text-secondary uppercase tracking-wider">Products</span>
               <p className="font-medium text-sm mt-1">{validatedOrder.products.length} product{validatedOrder.products.length !== 1 ? 's' : ''}</p>
            </div>
         </div>

         {/* Second row - Total Amount and Status */}
         <div className="flex flex-wrap justify-between items-end">
            <div className="w-1/2 sm:w-auto mb-3 sm:mb-0">
               <span className="text-xs text-secondary uppercase tracking-wider">Total Amount</span>
               <div className="mt-1 space-y-1">
                  <div className="flex justify-between text-xs">
                     <span>Original Amount :</span>
                     <span>₹{validatedOrder.totalOriginalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-accent-green">
                     <span>Offer Discount :</span>
                     <span>-₹{validatedOrder.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-border-color pt-1">
                     <span>Subtotal :</span>
                     <span>₹{validatedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span>Tax 0.8% :</span>
                     <span>+₹{validatedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-highlight text-sm border-t border-border-color pt-1">
                     <span>Payable Amount :</span>
                     <span>{" "}₹{validatedOrder.payableAmount.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
               {/* Order Status */}
               <div className="flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(validatedOrder.status)} ${validatedOrder.status === 'processing' ? 'animate-pulse' : ''}`}></span>
                  <span className="text-xs font-medium">{statusLabels[validatedOrder.status]}</span>
               </div>

               {/* Payment Status */}
               <div className="flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(validatedOrder.paymentStatus)} ${validatedOrder.paymentStatus === 'processing' ? 'animate-pulse' : ''}`}></span>
                  <span className="text-xs font-medium">Payment: {paymentStatusLabels[validatedOrder.paymentStatus]}</span>
               </div>
            </div>
         </div>

         {/* Action buttons based on combined status */}
         <div className="mt-4 pt-3 flex justify-end border-t border-border-color">
            {validatedOrder.status === 'pending' && (
               <div className="flex gap-2">
                  <button onClick={handleCancel} className="btn btn-secondary text-xs py-1.5 px-3">Cancel Order</button>
                  {validatedOrder.paymentStatus === 'pending' && (
                     <button onClick={handlePayment} className="btn btn-primary text-xs py-1.5 px-3">Complete Payment</button>
                  )}
                  {validatedOrder.paymentStatus === 'processing' && (
                     <div className="flex items-center">
                        <span className="status-live-icon mr-2 w-2 h-2 rounded-full bg-accent-orange animate-pulse inline-block"></span>
                        <span className="text-accent-orange font-medium text-xs">Processing payment...</span>
                     </div>
                  )}
               </div>
            )}

            {validatedOrder.status === 'completed' && validatedOrder.paymentStatus === 'completed' && (
               <button className="btn btn-primary bg-accent-green hover:bg-accent-green-light text-xs py-1.5 px-3">Rate Your Order</button>
            )}

            {validatedOrder.status === 'processing' && (
               <div className="flex items-center">
                  <span className="status-live-icon mr-2 w-2 h-2 rounded-full bg-accent-orange animate-pulse inline-block"></span>
                  <span className="text-accent-orange font-medium text-xs">Your order is being processed</span>
               </div>
            )}

            {validatedOrder.status === 'cancelled' && (
               <div className="text-accent-red text-xs py-1.5 px-3">
                  This order has been cancelled
               </div>
            )}
         </div>
      </div>
   );
};

export default OrderCard;