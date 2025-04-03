"use client"

import { OrderRow } from '@/components/OrderRow';
import { useGetPendingProcessingOrders } from '@/lib/react-query/queriesAndMutation'
import React, { useEffect, useRef, useState } from 'react'

const ProcessingOrdersPage = () => {
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
   } = useGetPendingProcessingOrders();

   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setIsVisible(entry.isIntersecting);
         },
         { threshold: 0.1 }
      );

      const currentElement = observerRef.current;

      if (currentElement) {
         observer.observe(currentElement);
      }

      return () => {
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

   if (isLoading) return <div className="text-center py-10">Loading orders...</div>
   if (isError) return <div className="text-center text-accent-red py-10">Error loading orders: {error?.message}</div>

   const allOrders = ordersData?.pages.flatMap(page => page.data) || [];

   return (
      <>
         <div className="space-y-4">
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
                        <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {allOrders.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-4 py-8 text-center text-secondary">No orders found</td>
                        </tr>
                     ) : (
                        allOrders.map((order) => (
                           <OrderRow
                              key={order._id}
                              order={order}
                           />
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            <div
               ref={observerRef}
               className="h-10 flex items-center justify-center"
            >
               {isFetchingNextPage && (
                  <div className="text-secondary">Loading more...</div>
               )}
            </div>
         </div>
      </>
   )
}

export default ProcessingOrdersPage