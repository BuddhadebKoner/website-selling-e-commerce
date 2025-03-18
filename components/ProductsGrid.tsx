"use client";
import React from 'react';
import Image from 'next/image';

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
   // Status styling based on status type
   const getStatusStyle = (status: string) => {
      switch (status?.toLowerCase()) {
         case 'live':
            return {
               background: 'var(--accent-green)',
               statusClass: 'status-live-icon'
            };
         case 'delay':
            return {
               background: 'var(--accent-yellow)',
               statusClass: ''
            };
         case 'inactive':
            return {
               background: 'var(--accent-red)',
               statusClass: ''
            };
         default:
            return {
               background: 'var(--text-secondary)',
               statusClass: ''
            };
      }
   };

   const { background, statusClass } = getStatusStyle(status);

   return (
      <div
         className="status-badge flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium"
         style={{ backgroundColor: background }}
      >
         <span className={`inline-block w-2 h-2 rounded-full bg-white ${statusClass}`}></span>
         <span>{status}</span>
      </div>
   );
};

// Format price from cents to dollars
const formatPrice = (price: number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
   }).format(price / 100);
};

// Define Product interface
interface Product {
   _id: string;
   title: string;
   price: number;
   status: string;
   bannerImageUrl: string;
   productType: string;
}

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
   const { title, price, status, bannerImageUrl, productType } = product;

   return (
      <div className="product-card card hover:scale-105 transition-all">
         <div className="relative w-full">
            {bannerImageUrl && bannerImageUrl.startsWith('http') ? (
               <img
                  src={bannerImageUrl}
                  alt={title}
                  className="product-image w-full h-48 object-cover"
               />
            ) : (
               <div className="product-image w-full h-48 bg-background-secondary flex items-center justify-center">
                  <span className="text-secondary">No image available</span>
               </div>
            )}

            {/* Status badge positioned at top right */}
            <div className="absolute top-2 right-2">
               <StatusBadge status={status} />
            </div>
         </div>

         <div className="product-info">
            <div className="text-xs text-secondary mb-1">{productType}</div>
            <h3 className="product-title">{title}</h3>
            <div className="product-price">{formatPrice(price)}</div>
            <button className="btn btn-primary add-to-cart mt-2 w-full">
               Add to Cart
            </button>
         </div>
      </div>
   );
};

// Products Grid Component
interface ProductsGridProps {
   products: Product[];
   isLoading: boolean;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, isLoading }) => {
   if (isLoading) {
      return (
         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
               <div key={item} className="product-card card animate-pulse">
                  <div className="w-full h-48 bg-background-secondary"></div>
                  <div className="p-4">
                     <div className="h-4 bg-background-secondary rounded w-3/4 mb-2"></div>
                     <div className="h-6 bg-background-secondary rounded w-1/2 mb-4"></div>
                     <div className="h-10 bg-background-secondary rounded"></div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
         ))}
      </div>
   );
};

export { ProductCard, ProductsGrid };