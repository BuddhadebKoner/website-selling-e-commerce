import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { searchProductCardProps } from '@/types/interfaces';
import { ExternalLink, Star } from 'lucide-react';

const SearchResultProduct = ({ product }: { product: searchProductCardProps }) => {
   // Calculate average rating
   const averageRating = product.totalRating > 0
      ? (product.totalSumOfRating / product.totalRating).toFixed(1)
      : '0.0';

   // Calculate price with discount if offer is active
   const isOfferActive = product.OfferStatus === 'live';
   const originalPrice = (product.price / 100).toFixed(2);
   const discountedPrice = isOfferActive
      ? ((product.price * (100 - product.discount)) / 100).toFixed(2)
      : originalPrice;

   return (
      <div className="product-card transition-all animate-fadeIn border rounded-lg border-theme ">
         {/* Product image */}
         <div className="relative w-full" style={{ height: '180px' }}>
            <Image
               src={product.bannerImageUrl}
               alt={product.title}
               fill
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               style={{ objectFit: 'cover' }}
               className="rounded-t-lg"
            />

            {/* Status badge */}
            {product.status === 'live' && (
               <div className="absolute top-2 right-2 bg-accent-green text-white text-xs px-2 py-1 rounded-full flex items-center status-badge">
                  <span className="w-2 h-2 bg-white rounded-full mr-1 status-live-icon"></span>
                  Live
               </div>
            )}

            {/* Discount tag */}
            {isOfferActive && (
               <div className="absolute top-2 left-2 bg-accent-red text-white text-xs px-2 py-1 rounded-full status-badge">
                  {product.discount}% OFF
               </div>
            )}
         </div>

         <div className="product-info p-4">
            {/* Product title */}
            <h3 className="product-title text-lg font-semibold mb-1 truncate">{product.title}</h3>

            {/* Product subtitle */}
            <p className="text-secondary text-sm mb-3 line-clamp-2" style={{ minHeight: '40px' }}>
               {product.subTitle}
            </p>

            {/* Price section */}
            <div className="flex items-center justify-between mt-auto">
               <div>
                  {isOfferActive ? (
                     <div className="flex items-center">
                        <span className="product-price text-lg">₹ {discountedPrice}</span>
                        <span className="text-secondary text-sm line-through ml-2">₹ {originalPrice}</span>
                     </div>
                  ) : (
                     <span className="product-price text-lg">₹ {originalPrice}</span>
                  )}
               </div>

               {/* Rating */}
               <div className="flex items-center">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="ml-1 text-sm">{averageRating}</span>
                  <span className="ml-1 text-xs text-secondary">({product.totalRating})</span>
               </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
               <Link href={`/templates/${product.productType}/${product.slug}`} className="btn btn-primary text-sm py-1 flex-1">
                  View Details
               </Link>
               <Link
                  href={product.liveLink}
                  target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-sm py-1">
                  <ExternalLink />
               </Link>
            </div>
         </div>
      </div>
   );
};

export default SearchResultProduct;