"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useUserAuthentication } from '@/context/AuthProvider';
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/shared/OrderSummary';
import { removeFromCart } from '@/endpoints/user.api';
import { ProcessedCartItem, CartTotals } from '@/types/interfaces';
import { LoaderCircle, ShoppingBag } from 'lucide-react';
import { calculateCartTotals, calculateDiscountedPrice } from '@/lib/priceCalculations';
import { createOrder } from '@/endpoints/order.api';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { currentUser, isLoading: isAuthLoading, refreshCurrentUser } = useUserAuthentication();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processedCartItems, setProcessedCartItems] = useState<ProcessedCartItem[]>([]);
  const [cartTotals, setCartTotals] = useState<CartTotals>({
    subtotal: 0,
    tax: 0,
    total: 0,
    discountAmount: 0,
    originalTotal: 0
  });

  const route = useRouter();
  const TAX_RATE = 0.08;

  useEffect(() => {
    if (!isAuthLoading && currentUser?.cart?.products) {
      const processedItems = processCartItems(currentUser.cart.products);
      setProcessedCartItems(processedItems);

      // Use the centralized calculation function
      const totals = calculateCartTotals(processedItems, TAX_RATE);
      setCartTotals(totals);
      setIsLoading(false);
    }
  }, [currentUser?.cart?.products, isAuthLoading]);

  const processCartItems = (cartProducts: any[]): ProcessedCartItem[] => {
    if (!cartProducts || !Array.isArray(cartProducts)) {
      return [];
    }

    const currentDate = new Date();

    return cartProducts.map(item => {
      const offerStart = item.offerStartDate ? new Date(item.offerStartDate) : null;
      const offerEnd = item.offerEndDate ? new Date(item.offerEndDate) : null;

      // Check if offer is active based on dates and status
      const isOfferActive =
        item.offerStatus === 'live' && // Fixed: changed 'OfferStatus' to 'offerStatus' 
        offerStart && offerEnd &&
        currentDate >= offerStart &&
        currentDate <= offerEnd &&
        item.discount > 0;

      const processedItem: ProcessedCartItem = {
        ...item,
        originalPrice: item.price,
        isOfferActive
      };

      // Calculate discounted price if offer is active
      if (isOfferActive) {
        processedItem.discountedPrice = calculateDiscountedPrice(
          item.price,
          item.discount,
          item.offerType === 'percentage' ? 'percentage' : 'fixed' // Fixed: changed 'OfferType' to 'offerType'
        );
      }

      return processedItem;
    });
  };

  const handleRemoveItem = async (productId: string) => {
    if (!currentUser?.cart?.id) {
      toast.error("Cart information not available");
      return;
    }

    setRemovingIds(prev => new Set(prev).add(productId));

    try {
      const response = await removeFromCart(productId, currentUser.cart.id);

      if (response.success) {
        const updatedItems = processedCartItems.filter(item => item._id !== productId);
        setProcessedCartItems(updatedItems);

        // Recalculate totals after removing item
        const updatedTotals = calculateCartTotals(updatedItems, TAX_RATE);
        setCartTotals(updatedTotals);

        await refreshCurrentUser();
        toast.success(response.message || "Product removed from cart successfully");
      } else {
        toast.error(response.error || "Failed to remove product from cart");
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error("An error occurred while removing the product");
    } finally {
      setRemovingIds(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    // Validate required fields
    if (
      !currentUser?.id ||
      cartTotals.originalTotal === undefined ||
      cartTotals.total === undefined ||
      cartTotals.discountAmount === undefined ||
      cartTotals.tax === undefined ||
      cartTotals.subtotal === undefined ||
      !processedCartItems || !Array.isArray(processedCartItems)
    ) {
      toast.error("All fields are required");
      setIsCheckingOut(false);
      return;
    }

    // Validate numeric values
    if (
      isNaN(cartTotals.originalTotal) ||
      isNaN(cartTotals.total) ||
      isNaN(cartTotals.discountAmount) ||
      isNaN(cartTotals.tax) ||
      isNaN(cartTotals.subtotal)
    ) {
      toast.error("All amounts must be valid numbers");
      setIsCheckingOut(false);
      return;
    }

    // Use the centralized cart totals for the checkout process
    const orderData = {
      owner: currentUser?.id || '',
      totalOriginalAmount: cartTotals.originalTotal,
      payableAmount: cartTotals.total,
      discountAmount: cartTotals.discountAmount,
      taxAmount: cartTotals.tax,
      subtotal: cartTotals.subtotal,
      products: [...processedCartItems.map(item => item._id)],
    };

    try {
      const res = await createOrder(orderData);
      console.log('Order Response:', res);
      if (res.success) {
        toast.success("Order placed successfully");
        // Optionally refresh the user data or redirect to an order confirmation page
        // /orders page
        route
        
      } else {
        toast.error(res.error || "Failed to place order");
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("An error occurred while placing the order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <LoaderCircle className="animate-spin h-12 w-12 mb-4 text-primary" />
        <h2 className="text-xl font-medium">Loading your cart...</h2>
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

  if (!currentUser.cart) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <ShoppingBag className="h-16 w-16 mb-4 text-secondary" />
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-secondary mb-8">No cart found for your account</p>
        <Link href="/templates" className="btn btn-primary">
          Browse Templates
        </Link>
      </div>
    );
  }

  if (!processedCartItems.length) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <ShoppingBag className="h-16 w-16 mb-4 text-secondary" />
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-secondary mb-8">Looks like you haven&apos;t added any items to your cart yet</p>
        <Link href="/templates" className="btn btn-primary">
          Browse Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">
        {currentUser?.fullName}'s Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-box border border-theme rounded-lg overflow-hidden shadow-sm mb-4">
            <div className="p-4 border-b border-theme bg-background-secondary flex justify-between">
              <h2 className="font-semibold">Items ({processedCartItems.length})</h2>
              <p className="text-secondary">
                {processedCartItems.length >= 5 ? (
                  <span className="text-accent-red">Cart full (5/5 items)</span>
                ) : (
                  <span>{processedCartItems.length}/5 items</span>
                )}
              </p>
            </div>
            <div className="divide-y divide-theme">
              {processedCartItems.map((item) => (
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
            <Link
              href="/templates"
              className="btn btn-secondary flex items-center gap-2"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={processedCartItems}
            subtotal={cartTotals.subtotal}
            tax={cartTotals.tax}
            total={cartTotals.total}
            onCheckout={handleCheckout}
            isLoading={isLoading}
            isCheckingOut={isCheckingOut}
            discountAmount={cartTotals.discountAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;