"use client"

import { useGetAllOrdersByStatus } from '@/lib/react-query/queriesAndMutation'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const { status } = useParams()

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllOrdersByStatus(status as string)

  const orders = data?.orders || []

  // Map status to color classes
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'accent-green';
      case 'processing': return 'highlight-primary';
      case 'pending': return 'accent-yellow';
      case 'cancelled': return 'accent-red';
      default: return 'accent-yellow';
    }
  }

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  // Format currency helper
  const formatCurrency = (amount) => {
    return `${Number(amount).toFixed(2)}`;
  }

  if (isLoading) return <div className="text-center py-10">Loading orders...</div>
  if (isError) return <div className="text-center text-accent-red py-10">Error loading orders: {error?.message}</div>

  return (
    <div className="bg-box rounded-lg overflow-hidden border border-theme">
      <table className="w-full">
        <thead className="bg-background-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-secondary">No orders found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="border-t border-theme">
                <td className="px-4 py-3 font-medium">{order.trackId}</td>
                <td className="px-4 py-3">{order.owner?.name || "Unknown"}</td>
                <td className="px-4 py-3 text-secondary">{formatDate(order.orderDate)}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(order.payableAmount)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-sm bg-opacity-10 ${`bg-${getStatusColor(order.status)} text-${getStatusColor(order.status)}`}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-sm bg-opacity-10 ${`bg-${getStatusColor(order.paymentStatus)} text-${getStatusColor(order.paymentStatus)}`}`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default page