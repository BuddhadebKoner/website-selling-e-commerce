"use client"

import Link from 'next/link'
import {
   DollarSign,
   ShoppingBag,
   Users,
   Package,
   AlertCircle
} from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { OrderRow } from '@/components/OrderRow'
import { useAllOrders } from '@/lib/react-query/queriesAndMutation';
import { useEffect, useRef, useState } from 'react'

export default function Page() {
   const {
      data: ordersData,
      isLoading,
      isError,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useAllOrders();

   const observerRef = useRef(null);
   const [isVisible, setIsVisible] = useState(false);

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
         // Use the stored variable in cleanup
         if (currentElement) {
            observer.unobserve(currentElement);
         }
      };
   }, []);

   // Trigger fetchNextPage when intersection observed
   useEffect(() => {
      if (isVisible && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [isVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

   // Extract all orders from all pages
   const allOrders = ordersData?.pages.flatMap(page => page.data) || [];

   return (
      <div className="w-full space-y-6 animate-fadeIn">
         <h2 className="text-2xl font-bold">Dashboard Overview</h2>

         {/* Stats cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
               icon={<DollarSign className="text-accent-green" size={24} />}
               title="Total Revenue"
               value="$24,512.00"
               change="+12.5%"
               positive={true}
            />
            <StatCard
               icon={<ShoppingBag className="text-accent-yellow" size={24} />}
               title="Total Orders"
               value="1,248"
               change="+8.2%"
               positive={true}
            />
            <StatCard
               icon={<Users className="text-highlight-primary" size={24} />}
               title="Total Customers"
               value="3,842"
               change="+5.4%"
               positive={true}
            />
            <StatCard
               icon={<Package className="text-highlight-secondary" size={24} />}
               title="Pending Orders"
               value="42"
               change="-2.5%"
               positive={false}
            />
         </div>

         {/* Recent orders */}
         <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Recent Orders</h3>
               <Link href="/admin-dashbord/orders" className="text-highlight-primary hover:text-highlight">
                  View all
               </Link>
            </div>

            {isLoading ? (
               <div className="bg-box rounded-lg p-8 text-center border border-theme">
                  <div className="animate-pulse">Loading recent orders...</div>
               </div>
            ) : isError ? (
               <div className="bg-box rounded-lg p-6 border border-accent-red">
                  <div className="flex items-center text-accent-red gap-2">
                     <AlertCircle size={20} />
                     <p>Error loading orders: {error?.message || 'Unknown error'}</p>
                  </div>
               </div>
            ) : (
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

                  {/* Intersection Observer Trigger - outside of table for better layout */}
                  <div
                     ref={observerRef}
                     className="h-10 flex items-center justify-center"
                  >
                     {isFetchingNextPage && (
                        <div className="text-secondary py-2">Loading more orders...</div>
                     )}
                     {!hasNextPage && allOrders.length > 0 && (
                        <div className="text-secondary py-2 text-sm">No more orders to load</div>
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* Top selling products */}
         <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Top Selling Products</h3>
               <Link href="/admin-dashbord/products" className="text-highlight-primary hover:text-highlight">
                  View all
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               products
            </div>
         </div>
      </div>
   )
}