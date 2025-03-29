"use client";

import { useUserAuthentication } from '@/context/AuthProvider';
import { useGetOrdersListByUserId } from '@/lib/react-query/queriesAndMutation';
import React from 'react';

const OrderPage = () => {
  const { currentUser, isLoading: isAuthLoading } = useUserAuthentication();

  const {
    data: ordersList,
    isLoading: isOrdersLoading,
    isError,
    error,
  } = useGetOrdersListByUserId(currentUser?.id || '');

  const handlePayNow = (orderId: string) => {
    console.log(`Pay Now clicked for order ID: ${orderId}`);
    // Add API call logic here later
  };

  const handleCancelOrder = (orderId: string) => {
    console.log(`Cancel Order clicked for order ID: ${orderId}`);
    // Add API call logic here later
  };

  if (isAuthLoading || isOrdersLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <div className="animate-fadeIn text-lg">Loading...</div>
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

  console.log("Orders List:", ordersList);
  return (
    <div className="w-full h-fit px-4 bg-background text-main-text flex flex-col  gap-6 md:flex-row md:gap-12 lg:gap-16 overflow-hidden">
      <div className="w-full max-w-4xl">
        {ordersList?.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {ordersList.map((order) => (
              <li
                key={order._id}
                className="card p-4 bg-box border-theme"
              >
                <div className="mb-2">
                  <span className="font-semibold">Invoice ID:</span> {order.invoiceId}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Payable Amount:</span> ₹{order.payableAmount}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={`status-badge ${order.status === 'pending' ? 'text-yellow' : 'text-green'
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Payment Status:</span>{' '}
                  <span
                    className={`status-badge ${order.paymentStatus === 'pending' ? 'text-orange' : 'text-green'
                      }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Order Date:</span>{' '}
                  {new Date(order.orderDate).toLocaleString()}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Products:</span>
                  <ul className="list-disc pl-5">
                    {order.products.map((product) => (
                      <li key={product._id}>
                        <div>
                          <span className="font-semibold">Title:</span> {product.title}
                        </div>
                        <div>
                          <span className="font-semibold">Price:</span> ₹{product.price}
                        </div>
                        <div>
                          <span className="font-semibold">Type:</span> {product.productType}
                        </div>
                        <div>
                          <span className="font-semibold">Offer Status:</span> {product.OfferStatus}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => handlePayNow(order._id)}
                  >
                    Pay Now
                  </button>
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-lg text-secondary">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;