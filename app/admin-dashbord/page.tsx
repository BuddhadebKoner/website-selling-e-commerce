"use client"

import Link from 'next/link'
import {
   DollarSign,
   ShoppingBag,
   Users,
   Package,
   AlertCircle,
   Loader2
} from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { OrderRow } from '@/components/OrderRow'
import { useAllOrders, useGetAllOffers } from '@/lib/react-query/queriesAndMutation';
import { useEffect, useRef, useState } from 'react'
import OfferRow from '@/components/OfferRow';
import { toast } from 'react-toastify'

export default function Page() {
   // Orders data fetching
   const {
      data: ordersData,
      isLoading: isOrdersLoading,
      isError: isOrdersError,
      error: ordersError,
      fetchNextPage: fetchNextOrdersPage,
      hasNextPage: hasNextOrdersPage,
      isFetchingNextPage: isFetchingNextOrdersPage,
   } = useAllOrders();

   // Offers data fetching
   const {
      data: offersData,
      hasNextPage: hasNextOffersPage,
      isFetchingNextPage: isFetchingNextOffersPage,
      isLoading: isOffersLoading,
      isError: isOffersError,
      error: offersError,
      fetchNextPage: fetchNextOffersPage,
      refetch: refetchOffers
   } = useGetAllOffers();


   // Intersection observer refs and states
   const ordersObserverRef = useRef(null);
   const offersObserverRef = useRef(null);
   const [isOrdersObserverVisible, setIsOrdersObserverVisible] = useState(false);
   const [isOffersObserverVisible, setIsOffersObserverVisible] = useState(false);

   // Setup intersection observer for orders pagination
   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setIsOrdersObserverVisible(entry.isIntersecting);
         },
         { threshold: 0.1 }
      );

      const currentElement = ordersObserverRef.current;
      if (currentElement) {
         observer.observe(currentElement);
      }

      return () => {
         if (currentElement) {
            observer.unobserve(currentElement);
         }
      };
   }, []);

   // Setup intersection observer for offers pagination
   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setIsOffersObserverVisible(entry.isIntersecting);
         },
         { threshold: 0.1 }
      );

      const currentElement = offersObserverRef.current;
      if (currentElement) {
         observer.observe(currentElement);
      }

      return () => {
         if (currentElement) {
            observer.unobserve(currentElement);
         }
      };
   }, []);

   // Fetch next page of orders when observer is visible
   useEffect(() => {
      if (isOrdersObserverVisible && hasNextOrdersPage && !isFetchingNextOrdersPage) {
         fetchNextOrdersPage();
      }
   }, [isOrdersObserverVisible, hasNextOrdersPage, isFetchingNextOrdersPage, fetchNextOrdersPage]);

   // Fetch next page of offers when observer is visible
   useEffect(() => {
      if (isOffersObserverVisible && hasNextOffersPage && !isFetchingNextOffersPage) {
         fetchNextOffersPage();
      }
   }, [isOffersObserverVisible, hasNextOffersPage, isFetchingNextOffersPage, fetchNextOffersPage]);

   // Handle offer deletion
   const handleDeleteOffer = async (id: string) => {
      console.log("Deleting offer with ID:", id);
   };

   // Prepare data for display
   const allOrders = ordersData?.pages?.flatMap(page => page?.data || []) || [];
   const allOffers = offersData?.pages?.flatMap(page => page?.offers || []) || [];

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
               value={`${allOrders.length || 0}`}
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
               value={`${allOrders.filter(order => order.status === "pending").length || 0}`}
               change="-2.5%"
               positive={false}
            />
         </div>

         {/* Recent orders */}
         <div className='w-full h-[30vh] overflow-auto px-2'>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Recent Orders</h3>
               <Link href="/admin-dashbord/orders" className="text-highlight-primary hover:text-highlight">
                  View all
               </Link>
            </div>

            {isOrdersLoading ? (
               <div className="bg-box rounded-lg p-8 text-center border border-theme">
                  <div className="flex justify-center items-center gap-2">
                     <Loader2 className="animate-spin" size={20} />
                     <span>Loading recent orders...</span>
                  </div>
               </div>
            ) : isOrdersError ? (
               <div className="bg-box rounded-lg p-6 border border-accent-red">
                  <div className="flex items-center text-accent-red gap-2">
                     <AlertCircle size={20} />
                     <p>Error loading orders: {ordersError instanceof Error ? ordersError.message : 'Unknown error'}</p>
                  </div>
                  <button
                     onClick={() => fetchNextOrdersPage()}
                     className="mt-3 px-4 py-2 bg-highlight-primary text-white rounded-md hover:bg-highlight transition-colors"
                  >
                     Try Again
                  </button>
               </div>
            ) : (
               <div className="bg-box rounded-lg overflow-hidden border border-theme">
                  {allOrders.length === 0 ? (
                     <div className="px-4 py-8 text-center text-secondary">
                        <p className="mb-2">No orders found</p>
                        <p className="text-sm text-gray-500">New orders will appear here when customers make purchases</p>
                     </div>
                  ) : (
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
                  )}

                  {/* Intersection Observer Trigger */}
                  <div
                     ref={ordersObserverRef}
                     className="h-10 flex items-center justify-center"
                  >
                     {isFetchingNextOrdersPage && (
                        <div className="flex items-center gap-2 text-secondary py-2">
                           <Loader2 className="animate-spin" size={16} />
                           <span>Loading more orders...</span>
                        </div>
                     )}
                     {!hasNextOrdersPage && allOrders.length > 0 && (
                        <div className="text-secondary py-2 text-sm">No more orders to load</div>
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* Top offers live */}
         <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Top Offers Live</h3>
               <Link href="/admin-dashbord/offers" className="text-highlight-primary hover:text-highlight">
                  Manage offers
               </Link>
            </div>

            {isOffersLoading ? (
               <div className="bg-box rounded-lg p-8 text-center border border-theme">
                  <div className="flex justify-center items-center gap-2">
                     <Loader2 className="animate-spin" size={20} />
                     <span>Loading active offers...</span>
                  </div>
               </div>
            ) : isOffersError ? (
               <div className="bg-box rounded-lg p-6 border border-accent-red">
                  <div className="flex items-center text-accent-red gap-2">
                     <AlertCircle size={20} />
                     <p>Error loading offers: {offersError instanceof Error ? offersError.message : 'Unknown error'}</p>
                  </div>
                  <button
                     onClick={() => refetchOffers()}
                     className="mt-3 px-4 py-2 bg-highlight-primary text-white rounded-md hover:bg-highlight transition-colors"
                  >
                     Try Again
                  </button>
               </div>
            ) : (
               <div className="bg-box rounded-lg overflow-hidden border border-theme">
                  {allOffers.length === 0 ? (
                     <div className="px-4 py-8 text-center text-secondary">
                        <p className="mb-2">No active offers found</p>
                        <p className="text-sm text-gray-500">Create new offers to attract more customers</p>
                        <Link
                           href="/admin-dashbord/offers/new"
                           className="mt-3 inline-block px-4 py-2 bg-highlight-primary text-white rounded-md hover:bg-highlight transition-colors"
                        >
                           Create New Offer
                        </Link>
                     </div>
                  ) : (
                     <table className="w-full">
                        <thead className="bg-background-secondary">
                           <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Discount</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Original Price</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Final Price</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {allOffers.map((offer) => (
                              <OfferRow
                                 key={offer._id}
                                 offer={offer}
                                 onDelete={handleDeleteOffer}
                              />
                           ))}
                        </tbody>
                     </table>
                  )}

                  {/* Pagination/loading indicator */}
                  <div
                     ref={offersObserverRef}
                     className="h-10 flex items-center justify-center"
                  >
                     {isFetchingNextOffersPage && (
                        <div className="flex items-center gap-2 text-secondary py-2">
                           <Loader2 className="animate-spin" size={16} />
                           <span>Loading more offers...</span>
                        </div>
                     )}
                     {!hasNextOffersPage && allOffers.length > 0 && (
                        <div className="text-secondary py-2 text-sm">No more offers to load</div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}