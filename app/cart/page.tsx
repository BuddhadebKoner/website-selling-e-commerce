"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useUserAuthentication } from '@/context/AuthProvider';
import CartItem, { CartProduct } from '@/components/CartItem';
import OrderSummary from '@/components/shared/OrderSummary';
import { removeFromCart } from '@/endpoints/user.api';

const CartPage = () => {
  const { currentUser, isLoading, refreshCurrentUser } = useUserAuthentication();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  // Calculate totals
  const cartItems: CartProduct[] = currentUser?.cart?.products || [];
  const itemCount = cartItems.length;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Handler for removing an item
  const handleRemoveItem = async (productId: string) => {
    setRemovingIds((prev) => new Set(prev.add(productId)));
    
    console.log(productId, currentUser?.cart?.id);

    const response = await removeFromCart(productId, currentUser?.cart?.id);
    if (response.success) {
      refreshCurrentUser();
      toast.success(response.message || "Product removed from cart successfully");
    } else {
      toast.error(response.error || "Failed to remove product from cart");
    }
  };

  // Handler for checkout
  const handleCheckout = () => {
    toast.info("Checkout functionality would be implemented here");
    // Redirect or open modal for checkout
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-pulse text-3xl mb-4">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-3xl font-bold mb-4">Please Sign In</h2>
        <p className="text-secondary mb-8">You need to be logged in to view your cart</p>
        <Link href="/sign-in" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (!currentUser.cart || cartItems.length === 0) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-secondary mb-8">Looks like you haven't added any items to your cart yet</p>
        <Link href="/templates" className="btn btn-primary">
          Browse Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-box border border-theme rounded-lg overflow-hidden shadow-sm mb-4">
            <div className="p-4 border-b border-theme bg-background-secondary flex justify-between">
              <h2 className="font-semibold">Items ({itemCount})</h2>
              <p className="text-secondary">
                {itemCount >= 5 ? (
                  <span className="text-accent-red">Cart full (5/5 items)</span>
                ) : (
                  <span>{itemCount}/5 items</span>
                )}
              </p>
            </div>
            <div className="divide-y divide-theme">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  isRemoving={removingIds.has(item._id)}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-start mb-8">
            <Link href="/templates" className="btn btn-secondary flex items-center gap-2">
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>
        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
