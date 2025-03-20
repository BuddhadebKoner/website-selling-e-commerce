'use client';

import { useUserAuthentication } from '@/context/AuthProvider';
import { addToCart } from '@/endpoints/user.api';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface ProductCardProps {
   _id: string;
   title: string;
   slug: string;
   subTitle?: string;
   price: number;
   status: string;
   bannerImageUrl: string;
   productType: string;
   totalSold: number;
   is_featured: boolean;
   technologyStack?: string[];
}

export function ProductCard({
   _id,
   title,
   slug,
   subTitle,
   price,
   status,
   bannerImageUrl,
   productType,
   totalSold,
   is_featured,
   technologyStack
}: ProductCardProps) {
   // Format price from cents to dollars
   const formattedPrice = `$${(price / 100).toFixed(2)}`;

   const { currentUser, refreshCurrentUser } = useUserAuthentication();
   const [addToCartLoading, setAddToCartLoading] = useState(false);

   // Status color mapping
   const statusColorClass = {
      'active': 'bg-accent-green bg-opacity-10 text-accent-green',
      'delay': 'bg-accent-yellow bg-opacity-10 text-accent-yellow',
      'inactive': 'bg-accent-red bg-opacity-10 text-accent-red'
   }[status] || 'bg-background-secondary text-secondary';

   // Hardcoded rating (replace with real data if available)
   const rating = 4.5;
   const fullStars = Math.floor(rating);
   const halfStar = rating % 1 >= 0.5;

   // Handler for adding product to cart
   const handleAddToCart = async () => {
      setAddToCartLoading(true);

      if (currentUser?.cart?.id === undefined) {
         if (currentUser?.id) {
            try {
               const res = await addToCart(currentUser.id, _id);
               if (res.success) {
                  refreshCurrentUser();
                  toast.success(res.message || "Added to cart successfully");
               } else {
                  toast.error(res.error || "Failed to add to cart");
               }
            } catch (error: any) {
               console.error(error);
               toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
            } finally { 
               setAddToCartLoading(false);
            }
         } else {
            console.error("User ID is undefined");
            toast.error("Please log in to add items to cart");
            setAddToCartLoading(false);
         }
      } else {
         if (currentUser?.id) {
            try {
               const res = await addToCart(currentUser.id, _id, currentUser.cart.id);
               if (res.success) {
                  refreshCurrentUser();
                  toast.success(res.message || "Added to cart successfully");
                  
                  // Show remaining slots message if available
                  if (res.remainingSlots !== undefined) {
                     toast.info(`You can add ${res.remainingSlots} more items to your cart`);
                  }
               } else {
                  // Special case for cart limit reached
                  if (res.error && res.error.includes("Cart limit reached")) {
                     toast.error("Your cart is full (max 5 products)");
                  } else {
                     toast.error(res.error || "Failed to add to cart");
                  }
               }
            } catch (error: any) {
               console.error(error);
               const errorMessage = error.response?.data?.error || "Failed to add to cart";
               toast.error(errorMessage);
            } finally {
               setAddToCartLoading(false);
            }
         } else {
            console.error("User ID is undefined");
            setAddToCartLoading(false);
            toast.error("Please log in to add items to cart");
         }
      }
   }

   return (
      <div className="group bg-box border border-theme rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
         {/* Image Section */}
         <div className="relative h-48 bg-background-secondary overflow-hidden">
            {bannerImageUrl ? (
               <Image
                  src={bannerImageUrl}
                  width={600}
                  height={300}
                  alt={title || "i"}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
               />
            ) : (
               <div className="flex items-center justify-center w-full h-full bg-gray-300">
                  i
               </div>
            )}
            {is_featured && (
               <div className="absolute top-2 left-2 z-10">
                  <span className="bg-highlight-primary text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                     Featured
                  </span>
               </div>
            )}
         </div>

         {/* Content Section */}
         <div className="p-4 space-y-2 relative">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
               <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${statusColorClass}`}>
                  {status || "i"}
               </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl font-semibold">{title || "i"}</h3>
            <p className="text-sm text-secondary">{subTitle || "i"}</p>

            {/* Rating Section */}
            <div className="flex items-center text-sm text-yellow-500">
               {Array(fullStars)
                  .fill(0)
                  .map((_, i) => (
                     <span key={i}>★</span>
                  ))}
               {halfStar && <span>☆</span>}
               <span className="text-secondary ml-1">({rating})</span>
            </div>

            {/* Product Type */}
            <span className="inline-block text-xs bg-background-secondary border border-theme px-2 py-1 rounded-full">
               {productType || "i"}
            </span>

            {/* Technology Stack Tags */}
            <div className="flex flex-wrap gap-1.5">
               {technologyStack && technologyStack.length > 0 ? (
                  technologyStack.map((tech, index) => (
                     <span
                        key={index}
                        className="bg-background-secondary text-xs px-2 py-1 rounded-full border border-theme text-secondary"
                     >
                        {tech}
                     </span>
                  ))
               ) : (
                  <span className="bg-background-secondary text-xs px-2 py-1 rounded-full border border-theme text-secondary">
                     i
                  </span>
               )}
            </div>

            {/* Price and Sold Count */}
            <div className="flex items-center justify-between pt-3 border-t border-theme">
               <div className="flex items-baseline gap-1">
                  <p className="font-bold text-highlight-primary text-xl">{formattedPrice}</p>
                  <span className="text-xs text-secondary">USD</span>
               </div>
               <p className="text-sm text-secondary font-medium">{totalSold} sold</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
               {
                  currentUser?.cart?.products?.find((product) => product._id === _id) ? (
                     <button
                        className="btn cursor-not-allowed"
                        disabled
                     >
                        In Cart
                     </button>
                  ) : (
                     <button
                        className="btn btn-primary"
                        onClick={handleAddToCart}
                        disabled={addToCartLoading}
                     >
                        {addToCartLoading ? "Adding..." : "Add to Cart"}
                     </button>
                  )
               }
               <Link href={`/templates/${slug}`} className="btn btn-secondary">
                  View Details
               </Link>
            </div>
         </div>
      </div>
   );
}
