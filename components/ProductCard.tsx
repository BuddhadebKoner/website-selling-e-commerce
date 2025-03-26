'use client';

import { useUserAuthentication } from '@/context/AuthProvider';
import { addToCart } from '@/endpoints/user.api';
import { ProductCardProps } from '@/types/interfaces';
import { LoaderCircle, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ProductPrice from './shared/ProductPrice';

export function ProductCard({
   _id,
   slug,
   title,
   subTitle,
   liveLink,
   productType,
   productAbout,
   price,
   websiteAge,
   status,
   images,
   bannerImageUrl,
   totalSold,
   totalRating,
   OfferStatus,
   OfferType,
   discount,
   rating: propRating,
   comment,
   isRatingFeatured,
   offerStartDate,
   offerEndDate,
   technologyStack,
}: ProductCardProps) {
   const { currentUser, refreshCurrentUser, isLoading } = useUserAuthentication();
   const [addToCartLoading, setAddToCartLoading] = useState(false);

   // Status color mapping
   const statusColorClass =
      {
         active: 'bg-accent-green bg-opacity-10 text-accent-green',
         delay: 'bg-accent-yellow bg-opacity-10 text-accent-yellow',
         inactive: 'bg-accent-red bg-opacity-10 text-accent-red',
      }[status] || 'bg-background-secondary text-secondary';

   // Use provided rating or fallback to a default value
   const rating = propRating || 4.5;
   const fullStars = Math.floor(rating);
   const halfStar = rating % 1 >= 0.5;

   // Handler for adding product to cart
   const handleAddToCart = async () => {
      if (addToCartLoading || isLoading) return;
      setAddToCartLoading(true);
      if (!currentUser?.id) {
         toast.error('Please log in to add items to cart');
         setAddToCartLoading(false);
         return;
      }
      try {
         const cartId = currentUser?.cart?.id;
         const res = await addToCart(_id, cartId);
         if (res.success) {
            refreshCurrentUser();
            toast.success(res.message || 'Added to cart successfully');
         } else {
            if (res.error?.includes('Cart limit reached')) {
               toast.error('Your cart is full (max 5 products)');
            } else if (res.error?.includes('already in your cart')) {
               toast.error('This product is already in your cart');
            } else {
               toast.error(res.error || 'Failed to add to cart');
            }
         }
      } catch (error) {
         console.error('Error handling add to cart:', error);
         toast.error('Something went wrong. Please try again.');
      } finally {
         setAddToCartLoading(false);
      }
   };

   return (
      <div className="group bg-box border border-theme rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
         {/* Image Section */}
         <div className="relative h-100 bg-background-secondary overflow-hidden">
            <Link href={`/templates/${productType}/${slug}`}>
               {bannerImageUrl ? (
                  <Image
                     src={bannerImageUrl}
                     width={600}
                     height={300}
                     alt={title || 'Image'}
                     className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center bg-background-secondary text-accent-red text-2xl">
                     Image not found
                  </div>
               )}
            </Link>
         </div>

         {/* Content Section */}
         <div className="p-4 space-y-2 relative">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
               <span
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${statusColorClass}`}
               >
                  {status || 'N/A'}
               </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl font-semibold">{title || 'N/A'}</h3>
            <p className="text-sm text-secondary">{subTitle || 'N/A'}</p>

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
               {productType || 'N/A'}
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
                     N/A
                  </span>
               )}
            </div>

            {/* Price Section */}
            <ProductPrice
               originalPrice={price}
               OfferStatus={OfferStatus}
               OfferType={OfferType}
               discount={discount}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
               {status === 'unavailable' || status === 'unabaliable' ? (
                  <div className="flex items-center gap-2">
                     <button className="btn cursor-not-allowed btn-secondary" disabled>
                        Unavailable
                     </button>
                     <span className="text-accent-red text-sm">
                        Wait some time, this is temporarily unavailable
                     </span>
                  </div>
               ) : status === 'delay' ? (
                  <div className="flex items-center gap-2">
                     <button className="btn btn-secondary" disabled>
                        Delayed
                     </button>
                     <span className="text-accent-yellow text-sm">
                        Expect some delay in delivery
                     </span>
                  </div>
               ) : currentUser?.cart?.products?.some((product) => product._id === _id) ? (
                  <Link className="btn btn-primary" href="/cart">
                     Go to Cart
                  </Link>
               ) : (
                  <button
                     className="btn btn-primary"
                     onClick={handleAddToCart}
                     disabled={addToCartLoading || isLoading}
                  >
                     {addToCartLoading ? (
                        <span className="flex items-center gap-1">
                           <LoaderCircle className="animate-spin" size={16} />
                           Adding...
                        </span>
                     ) : isLoading ? (
                        <span className="flex items-center gap-1">
                           <LoaderCircle className="animate-spin" size={16} />
                           Loading...
                        </span>
                     ) : (
                        <span className="flex items-center gap-1">
                           <ShoppingBag size={16} />
                           Add to Cart
                        </span>
                     )}
                  </button>
               )}

               <Link href={`/templates/${slug}`} className="btn btn-secondary">
                  View Details
               </Link>
            </div>
         </div>
      </div>
   );
}
