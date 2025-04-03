'use client'

import { Check, CircleMinus, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUpdateOrderAction } from "@/lib/react-query/queriesAndMutation";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { useState } from "react";
import { toast } from "react-toastify";

// Define proper Order interface
export interface Order {
  _id: string;
  trackId: string;
  owner: {
    _id: string;
    name: string;
  } | null;
  orderDate: string;
  payableAmount: number;
  status: string;
  paymentStatus: string;
}

// Fix props by using proper interface and destructuring
export function OrderRow({ order }: { order: Order }) {
  const queryClient = useQueryClient();
  const { refetch } = useUpdateOrderAction(order._id);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  // handle change status 
  const handleChangeStatus = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      await refetch();
      // After successful update, invalidate related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PENDING_PROCESSING_ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_ORDERS] });
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error(`Error changing status for order ${order._id}`, error);
      setHasError(true);
      toast.error("Failed to update order status");
    } finally {
      setIsLoading(false);
    }
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
      <td className="px-4 py-3">
        {
          order.status.toLowerCase() === 'processing' && order.paymentStatus.toLowerCase() === 'pending' ? (
            <button
              onClick={handleChangeStatus}
              disabled={isLoading}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${hasError
                  ? "bg-accent-red/10 hover:bg-accent-red/20"
                  : "bg-background-secondary hover:bg-background-secondary/80"
                }`}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-highlight-primary" />
              ) : hasError ? (
                <CircleMinus className="w-5 h-5 text-accent-red" />
              ) : (
                <Check className="w-5 h-5 text-accent-green hover:text-accent-green/80 transition-colors" />
              )}
            </button>
          ) : (
            <button
              disabled={true}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-background-secondary hover:bg-background-secondary/80 transition-colors">
              <CircleMinus
                className="w-5 h-5 text-accent-green hover:text-accent-green/80 transition-colors"
              />
            </button>
          )
        }
      </td>
    </tr>
  )
}