"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useUserAuthentication } from '@/context/AuthProvider';
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/shared/OrderSummary';
import { removeFromCart } from '@/endpoints/user.api';
import { ProcessedCartItem, CartTotals, CartProductItem } from '@/types/interfaces';
import { LoaderCircle, ShoppingBag } from 'lucide-react';
import { calculateCartTotals, calculateDiscountedPrice } from '@/lib/priceCalculations';
import { useCreateOrder } from '@/lib/react-query/queriesAndMutation';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { currentUser, isLoading: isAuthLoading, refreshCurrentUser } = useUserAuthentication();
  const { mutate: createOrderMutation, isPending: isCheckingOut } = useCreateOrder();
  const router = useRouter();

  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [processedCartItems, setProcessedCartItems] = useState<ProcessedCartItem[]>([]);
  const [cartTotals, setCartTotals] = useState<CartTotals>({
    subtotal: 0,
    tax: 0,
    total: 0,
    discountAmount: 0,
    originalTotal: 0
  });

  const TAX_RATE = 0.08;

  useEffect(() => {
    if (!isAuthLoading && currentUser?.cart?.products) {
      try {
        const processedItems = processCartItems(currentUser.cart.products);
        setProcessedCartItems(processedItems);

        const totals = calculateCartTotals(processedItems, TAX_RATE);
        setCartTotals(totals);
      } catch (error) {
        console.error('Error processing cart items:', error);
        toast.error('Error loading cart items');
      } finally {
        setIsLoading(false);
      }
    } else if (!isAuthLoading) {
      // If authentication loaded but no cart
      setIsLoading(false);
    }
  }, [currentUser?.cart?.products, isAuthLoading]);

  const processCartItems = (cartProducts: CartProductItem[]): ProcessedCartItem[] => {
    if (!cartProducts || !Array.isArray(cartProducts)) {
      return [];
    }

    const currentDate = new Date();

    return cartProducts.map(item => {
      const offerStart = item.offerStartDate ? new Date(item.offerStartDate) : null;
      const offerEnd = item.offerEndDate ? new Date(item.offerEndDate) : null;

      const isOfferActive =
        item.OfferStatus === 'live' &&
        offerStart && offerEnd &&
        currentDate >= offerStart &&
        currentDate <= offerEnd &&
        item.discount > 0;

      const processedItem: ProcessedCartItem = {
        ...item,
        originalPrice: item.price,
        isOfferActive: isOfferActive || undefined
      };

      if (isOfferActive) {
        processedItem.discountedPrice = calculateDiscountedPrice(
          item.price,
          item.discount,
          item.OfferType === 'percentage' ? 'percentage' : 'fixed'
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

    try {
      setRemovingIds(prev => new Set(prev).add(productId));

      const response = await removeFromCart(productId, currentUser.cart.id);

      if (response.success) {
        const updatedItems = processedCartItems.filter(item => item._id !== productId);
        setProcessedCartItems(updatedItems);

        const updatedTotals = calculateCartTotals(updatedItems, TAX_RATE);
        setCartTotals(updatedTotals);

        await refreshCurrentUser();
        toast.success(response.message || "Product removed from cart successfully");
      } else {
        throw new Error(response.error || "Failed to remove product from cart");
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error(error instanceof Error ? error.message : "An error occurred while removing the product");
    } finally {
      setRemovingIds(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const validateCartData = () => {
    if (!currentUser?.id) {
      toast.error("You must be logged in to checkout");
      return false;
    }

    if (!processedCartItems || !processedCartItems.length) {
      toast.error("Your cart is empty");
      return false;
    }

    const { originalTotal, total, discountAmount, tax, subtotal } = cartTotals;

    if (
      originalTotal === undefined ||
      total === undefined ||
      discountAmount === undefined ||
      tax === undefined ||
      subtotal === undefined
    ) {
      toast.error("Cart calculation error. Please refresh the page.");
      return false;
    }

    if (
      isNaN(originalTotal) ||
      isNaN(total) ||
      isNaN(discountAmount) ||
      isNaN(tax) ||
      isNaN(subtotal)
    ) {
      toast.error("Invalid cart amounts. Please refresh the page.");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateCartData()) return;

    const orderData = {
      owner: currentUser?.id || '',
      totalOriginalAmount: cartTotals.originalTotal,
      payableAmount: cartTotals.total,
      discountAmount: cartTotals.discountAmount,
      taxAmount: cartTotals.tax,
      subtotal: cartTotals.subtotal,
      products: processedCartItems.map(item => item._id),
    };

    createOrderMutation(orderData, {
      onSuccess: (response) => {
        if (response.status === 403) {
          toast.warning(response.error || "You already have a pending order");
          router.push("/orders");
          return;
        }

        if (response.success) {
          toast.success("Order placed successfully");
          router.push("/orders");
        } else {
          toast.error(response.error || "Failed to place order");
        }
      },
      onError: (error) => {
        console.error('Error placing order:', error);
        toast.error("An error occurred while placing the order");
      }
    });
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
        {currentUser?.fullName}&apos;s Shopping Cart
      </h1>

      <div className="w-full h-fit p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
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