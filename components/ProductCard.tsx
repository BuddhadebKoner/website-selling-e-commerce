'use client';

import { useUserAuthentication } from '@/context/AuthProvider';
import { addToCart } from '@/endpoints/user.api';
import { ProductCardProps } from '@/types/interfaces';
import { ExternalLink, LoaderCircle, ShoppingBag } from 'lucide-react';
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
   tags,
   price,
   websiteAge,
   status,
   images,
   bannerImageUrl,
   is_featured,
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

   // Status color mapping - updated to match product data status values
   const statusColorClass =
      status === 'live' ? 'bg-accent-green bg-opacity-10 text-accent-green' :
         status === 'delay' ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow' :
            status === 'unavailable' || status === 'unabaliable' ? 'bg-accent-red bg-opacity-10 text-accent-red' :
               'bg-background-secondary text-secondary';

   // Use provided rating or fallback to a default value
   const rating = propRating || 0;
   const fullStars = Math.floor(rating);
   const halfStar = rating % 1 >= 0.5;
   const displayRating = rating > 0 ? rating : totalRating > 0 ? totalRating : 0;

   // Display "New" badge if website is less than 30 days old
   const isNewProduct = websiteAge < 30;

   // Display featured badge
   const isFeatured = is_featured;

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

   // Check if offer is valid by confirming dates
   const isOfferValid = () => {
      if (OfferStatus !== 'live') return false;

      const now = new Date();
      const startDate = new Date(offerStartDate);
      const endDate = new Date(offerEndDate);

      return now >= startDate && now <= endDate;
   };

   return (
      <div className="group bg-box border border-theme rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
         {/* Image Section */}
         <div className="relative h-100 bg-background-secondary overflow-hidden">
            <Link href={`/templates/${productType.toLowerCase()}/${slug}`}>
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

            {/* Special Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
               {isNewProduct && (
                  <span className="bg-accent-blue text-white text-xs px-2 py-0.5 rounded-full">
                     New
                  </span>
               )}

               {isFeatured && (
                  <span className="bg-accent-purple text-white text-xs px-2 py-0.5 rounded-full">
                     Featured
                  </span>
               )}

               {isOfferValid() && (
                  <span className="bg-accent-green text-white text-xs px-2 py-0.5 rounded-full">
                     Sale
                  </span>
               )}
            </div>
         </div>

         {/* Content Section */}
         <div className="p-4 space-y-2 relative">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
               <span
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${statusColorClass}`}
               >
                  {status === 'live' ? 'Active' : status}
               </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl font-semibold">{title || 'N/A'}</h3>
            <p className="text-sm text-secondary line-clamp-2">{subTitle || 'N/A'}</p>

            {/* Rating Section */}
            <div className="flex items-center text-sm">
               <div className="text-yellow-500">
                  {Array(5).fill(0).map((_, i) => (
                     <span key={i}>{i < fullStars ? '★' : (i === fullStars && halfStar) ? '☆' : '☆'}</span>
                  ))}
               </div>
               <span className="text-secondary ml-1">({displayRating})</span>
               {totalSold > 0 && (
                  <span className="text-secondary ml-3 text-xs">
                     {totalSold} sold
                  </span>
               )}
            </div>

            {/* Live Link */}
            {liveLink && (
               <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-accent-blue hover:underline"
               >
                  Demo
               </a>
            )}

            {/* Product Type & Age */}
            <div className="flex flex-wrap gap-2 items-center">
               <span className="inline-block text-xs bg-background-secondary border border-theme px-2 py-1 rounded-full">
                  {productType || 'N/A'}
               </span>

               {websiteAge > 0 && (
                  <span className="text-xs text-secondary">
                     {websiteAge} days old
                  </span>
               )}
            </div>

            {/* Technology Stack Tags */}
            <div className="flex flex-wrap gap-1.5">
               {technologyStack && technologyStack.length > 0 ? (
                  technologyStack.slice(0, 3).map((tech, index) => (
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

               {technologyStack && technologyStack.length > 3 && (
                  <span className="bg-background-secondary text-xs px-2 py-1 rounded-full border border-theme text-secondary">
                     +{technologyStack.length - 3} more
                  </span>
               )}
            </div>

            {/* Price Section */}
            <ProductPrice
               originalPrice={price}
               OfferStatus={isOfferValid() ? OfferStatus : 'unavailable'}
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
                     disabled={addToCartLoading || isLoading || status !== 'live'}
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

               <Link href={`/templates/${productType.toLowerCase()}/${slug}`} className="btn btn-secondary">
                  View Details
               </Link>
            </div>
         </div>
      </div>
   );
}