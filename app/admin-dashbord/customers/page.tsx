'use client'

import UserDataInRow from '@/components/UserDataInRow';
import { useGetAllUsers } from '@/lib/react-query/queriesAndMutation';
import React from 'react';
import { useInView } from 'react-intersection-observer';

export interface IUsers {
   _id: string;
   name: string;
   email: string;
   spent: string;
   createdAt: string;
   totalOrders: string;
}

export default function page() {
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      isLoading,
      isError
   } = useGetAllUsers();

   const { ref, inView } = useInView();

   React.useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   if (isLoading) return <div>Loading...</div>;
   if (isError) return <div>Error...</div>;


   return (
      <div className="space-y-6 animate-fadeIn">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customers</h2>
         </div>

         <div className="bg-box rounded-lg overflow-hidden border border-theme">
            <table className="w-full">
               <thead className="bg-background-secondary">
                  <tr>
                     <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Spent</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Total Orders</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Created At</th>
                  </tr>
               </thead>
               <tbody>
                  {data?.pages.map((page) =>
                     (page.data || []).map((users: IUsers) => (
                        <UserDataInRow
                           key={users._id}
                           items={{
                              _id: users._id,
                              name: users.name,
                              email: users.email,
                              spent: users.spent.toString(),
                              totalOrders: users.totalOrders.toString(),
                              createdAt: new Date(users.createdAt).toLocaleDateString(
                                 'en-IN',
                                 {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                 }
                              ),
                           }}
                        />
                     ))
                  )}
               </tbody>
            </table>
         </div>

         {/* Intersection observer target for infinite scroll */}
         <div ref={ref} className="h-10" />

         {isFetchingNextPage && (
            <div className="text-center">Loading more...</div>
         )}
         {isFetching && !isFetchingNextPage && (
            <div className="text-center">Fetching...</div>
         )}
      </div>
   );
}
