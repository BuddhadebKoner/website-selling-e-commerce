"use client";

import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/interfaces';

// Updated to accept a single order
interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
   // Status color mapping
   const statusColors: Record<Order['status'], string> = {
      pending: 'text-yellow',
      processing: 'text-accent-orange',
      shipped: 'text-accent-green-light',
      delivered: 'text-accent-green',
      cancelled: 'text-accent-red'
   };

   return (
      <Link
         href={`/orders/${order.trackId}`}
         className="card p-4 transition-all cursor-pointer"
      >
         <div className="flex justify-between items-start mb-3">
            <div>
               <span className="text-xs text-secondary">Tracking ID</span>
               <h3 className="font-medium">{order.trackId}</h3>
            </div>
            <span className={`status-badge ${statusColors[order.status]} px-2 py-1 rounded-full text-xs font-medium`}>
               {order.status}
            </span>
         </div>

         <div className="mb-3">
            <span className="text-xs text-secondary">Order Date</span>
            <p>{new Date(order.orderDate).toLocaleDateString()}</p>
         </div>

         <div className="mb-3">
            <span className="text-xs text-secondary">Items</span>
            <p>{order.products.length} product{order.products.length !== 1 ? 's' : ''}</p>
         </div>

         <div className="flex justify-between items-end mt-2">
            <div>
               <span className="text-xs text-secondary">Total</span>
               <p className="text-lg font-bold">₹{order.payableAmount.toFixed(2)}</p>
            </div>
            <span className={`status-badge ${order.paymentStatus === 'pending' ? 'text-accent-orange' : 'text-accent-green'} text-xs`}>
               {order.paymentStatus}
            </span>
         </div>
      </Link>
   );
};

export default OrderCard;