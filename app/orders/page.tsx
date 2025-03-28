"use client";

import { useUserAuthentication } from '@/context/AuthProvider'
import { useGetOrdersListByUserId } from '@/lib/react-query/queriesAndMutation';
import React from 'react'

const OrderPage = () => {
  const { currentUser, isLoading: isAuthLoading } = useUserAuthentication();

  const {
    data: ordersList,
    isLoading: isOrdersLoading,
    isError,
    error,
    isFetching,
  } = useGetOrdersListByUserId(currentUser?.id || '');

  console.log('ordersList:', ordersList);

  if (isAuthLoading || isOrdersLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Orders</h1>
      {ordersList?.length > 0 ? (
        <ul>
          {ordersList.map((order) => (
            <li key={order._id}>
              <div>Order ID: {order._id}</div>
              <div>Invoice ID: {order.invoiceId}</div>
              <div>Payable Amount: {order.payableAmount}</div>
              <div>Status: {order.status}</div>
              <div>Payment Status: {order.paymentStatus}</div>
              <div>Order Date: {new Date(order.orderdate).toLocaleString()}</div>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <div>No orders found</div>
      )}
    </div>
  );
}

export default OrderPage;