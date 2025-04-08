"use client"

import { OrderRow } from '@/components/OrderRow';
import { useAllOrders } from '@/lib/react-query/queriesAndMutation';
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle, PackageX } from 'lucide-react';

const OrdersTable = () => {
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useAllOrders();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    // Store the current element in a variable
    const currentElement = observerRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      // Use the stored variable in cleanup instead of observerRef.current
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Extract all orders from all pages with proper validation
  const allOrders = ordersData?.pages?.flatMap(page => page?.data || []) || [];
  const hasOrders = allOrders.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin w-8 h-8 text-highlight-primary" />
          <p className="text-secondary mt-2">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-box rounded-lg p-8 text-center border border-accent-red my-4">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="text-accent-red w-8 h-8" />
          <p className="text-accent-red font-medium mt-2">
            Error loading orders
          </p>
          <p className="text-secondary mb-4">
            {error instanceof Error ? error.message : "An unknown error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-highlight-primary text-white rounded-md hover:bg-highlight transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hasOrders) {
    return (
      <div className="bg-box rounded-lg p-10 text-center border border-theme my-4">
        <div className="flex flex-col items-center gap-2">
          <PackageX className="text-secondary w-12 h-12 mb-2" />
          <h3 className="text-xl font-semibold">No Orders Found</h3>
          <p className="text-secondary max-w-md mx-auto mt-2">
            There are currently no orders in the system. New orders will appear here when customers make purchases.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-box rounded-lg overflow-hidden border border-theme">
        <table className="w-full">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Index</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Payment Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, idx) => (
              <OrderRow
                key={order._id}
                order={order}
                index={idx + 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Intersection Observer Trigger */}
      <div
        ref={observerRef}
        className="h-10 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-secondary">
            <Loader2 className="animate-spin" size={16} />
            <span>Loading more orders...</span>
          </div>
        )}
        {!hasNextPage && hasOrders && (
          <div className="text-secondary text-sm">
            You&apos;ve reached the end of the orders list
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersTable;