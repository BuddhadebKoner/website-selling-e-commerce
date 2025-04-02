"use client";

import { useUserAuthentication } from '@/context/AuthProvider';
import { useGetOrdersListByUserId } from '@/lib/react-query/queriesAndMutation';
import React from 'react';
import OrderCard from '@/components/OrderCard';
import Link from 'next/link';
import { Order } from '@/types/interfaces';
import { LoaderCircle } from 'lucide-react';

const OrderPage = () => {
  const { currentUser, isLoading: isAuthLoading } = useUserAuthentication();

  const {
    data: ordersList,
    isLoading: isOrdersLoading,
    isError,
    error,
  } = useGetOrdersListByUserId(currentUser?.id || '');

  if (isAuthLoading || isOrdersLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <LoaderCircle className='animate-spin h-8 w-8' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-red">
        <div className="text-lg">Error: {error.message}</div>
      </div>
    );
  }

  const orders: Order[] = ordersList || [];
  const totalOrders = orders.length;

  return (
    <div className="w-full min-h-screen bg-background pb-12 pt-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {totalOrders > 0 ? (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">All Orders{" "}
              <span className='text-sm'>{"("}{totalOrders}{")"}</span>
            </h2>

            <div className="w-full h-fit flex flex-col gap-4">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-theme rounded-lg">
            <h3 className="text-xl font-medium mb-2">No orders found</h3>
            <p className="text-secondary mb-6">You haven&apos;t placed any orders yet.</p>
            <Link href="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;