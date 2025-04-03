"use client"

import { OrderRow } from '@/components/OrderRow'
import { useGetAllOrdersByStatus } from '@/lib/react-query/queriesAndMutation'
import { useParams } from 'next/navigation'
import React from 'react'
import { Order } from '@/components/OrderRow' // Import the Order interface from OrderRow

const Page = () => {
  const { status } = useParams()

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllOrdersByStatus(status as string)

  const orders: Order[] = data?.orders || []

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
              <OrderRow
                key={order._id}
                order={order}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Page