'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

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
   const handleAddToCart = () => {
      console.log(`Product ${_id} added to cart.`);
      // Replace with your add-to-cart logic
   };

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
               <button onClick={handleAddToCart} className="btn btn-primary">
                  Add to Cart
               </button>
               <Link href={`/templates/${slug}`} className="btn btn-secondary">
                  View Details
               </Link>
            </div>
         </div>
      </div>
   );
}
