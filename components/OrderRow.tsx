'use client'

import React from 'react'

// Define proper Order interface
export interface Order {
  _id: string;
  trackId: string;
  owner?: { name: string } | null;
  orderDate: string;
  payableAmount: number;
  status: string;
  paymentStatus: string;
}

// Fix props by using proper interface and destructuring
export function OrderRow({ order }: { order: Order }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'accent-green';
      case 'processing': return 'highlight-primary';
      case 'pending': return 'accent-yellow';
      case 'cancelled': return 'accent-red';
      default: return 'accent-yellow';
    }
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return `${Number(amount).toFixed(2)}`;
  }

  return (
    <tr key={order._id} className="border-t border-theme hover:bg-background-secondary/30 transition-colors">
      <td className="px-4 py-3 font-medium">{order.trackId}</td>
      <td className="px-4 py-3">{order.owner?.name || "Unknown"}</td>
      <td className="px-4 py-3 text-secondary">{formatDate(order.orderDate)}</td>
      <td className="px-4 py-3 font-medium">₹ {formatCurrency(order.payableAmount)}</td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-1 rounded text-xs bg-opacity-10 ${`bg-${getStatusColor(order.status)} text-${getStatusColor(order.status)}`}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-1 rounded text-xs bg-opacity-10 ${`bg-${getStatusColor(order.paymentStatus)} text-${getStatusColor(order.paymentStatus)}`}`}>
          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
        </span>
      </td>
    </tr>
  )
}