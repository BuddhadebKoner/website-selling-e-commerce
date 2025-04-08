"use client"

import { useGetProductBySlug } from '@/lib/react-query/queriesAndMutation';
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserAuthentication } from '@/context/AuthProvider';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import ProductImageGallery from '@/components/ProductImageGalleryProps';
import ProductPriceDetails from '@/components/ProductPriceDetails';
import ProductReviews from '@/components/ProductReviews';
import { ProductCardProps } from '@/types/interfaces';
import { toast } from 'react-toastify';

const ProductDetailsPage = () => {
   const { slug, id: productType } = useParams();
   const [activeTab, setActiveTab] = useState('description');
   const { currentUser, refreshCurrentUser, isLoading: isAuthLoading } = useUserAuthentication();
   const [isOfferActive, setIsOfferActive] = useState(false);

   // Query product data
   const {
      data,
      isLoading,
      isError,
      error,
      refetch
   } = useGetProductBySlug(slug as string);

   const product: ProductCardProps | undefined = data?.product;

   // Check if offer is active
   useEffect(() => {
      if (product) {
         // Verify if offer is valid based on dates and status
         const now = new Date();
         const startDate = new Date(product.offerStartDate);
         const endDate = new Date(product.offerEndDate);

         setIsOfferActive(
            product.OfferStatus === "live" &&
            now >= startDate &&
            now <= endDate &&
            product.discount > 0
         );
      }
   }, [product]);

   // Handle retry on error
   const handleRetry = () => {
      refetch();
      toast.info("Retrying to fetch product data...");
   };

   // Loading state
   if (isLoading) {
      return (
         <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4">
            <div className="text-center">
               <LoaderCircle className="animate-spin h-8 w-8 sm:h-10 sm:w-10 mb-4 mx-auto text-primary" />
               <div className="text-lg sm:text-xl font-medium">Loading product details...</div>
            </div>
         </div>
      )
   }

   // Error state
   if (isError || !product) {
      return (
         <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4">
            <div className="text-center bg-box p-8 rounded-lg border border-theme max-w-md w-full">
               <AlertCircle className="h-12 w-12 text-accent-red mx-auto mb-4" />
               <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                  {isError ? "Error Loading Product" : "Product Not Found"}
               </h2>
               <p className="text-secondary mb-6">
                  {error instanceof Error
                     ? error.message
                     : "The product you are looking for does not exist or has been removed."}
               </p>
               <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                     onClick={handleRetry}
                     className="btn btn-secondary mb-3 sm:mb-0"
                  >
                     Try Again
                  </button>
                  <Link href="/templates" className="btn btn-primary">
                     Browse Templates
                  </Link>
               </div>
            </div>
         </div>
      )
   }

   // Format prices
   const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
   });

   const formattedPrice = formatter.format(product.price);

   let discountedPrice = product.price;
   if (isOfferActive) {
      if (product.OfferType === "percentage") {
         discountedPrice = product.price - (product.price * (product.discount / 100));
      } else if (product.OfferType === "fixed") {
         discountedPrice = product.price - product.discount;
      }
   }

   const formattedDiscountedPrice = formatter.format(discountedPrice);

   // Check if product is in user's cart
   const isInCart = currentUser?.cart?.products?.some(cartProduct =>
      cartProduct._id === product._id
   ) ?? false;

   // Status color mapping
   const statusColorClass =
      product.status === 'live' ? 'bg-accent-green bg-opacity-10 text-accent-green' :
         product.status === 'delay' ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow' :
            product.status === 'unavailable' || product.status === 'unabaliable' ? 'bg-accent-red bg-opacity-10 text-accent-red' :
               'bg-background-secondary text-secondary';

   return (
      <div className="bg-background min-h-screen pb-12 sm:pb-16">
         <div className="container mx-auto px-4 py-4 sm:py-6">
            {/* Breadcrumb navigation - improved for mobile */}
            <nav className="mb-4 sm:mb-6 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
               <ol className="flex items-center">
                  <li className="flex items-center">
                     <Link href="/" className="text-secondary hover:text-primary">
                        Home
                     </Link>
                     <span className="mx-1 sm:mx-2 text-secondary">/</span>
                  </li>
                  <li className="flex items-center">
                     <Link href="/templates" className="text-secondary hover:text-primary">
                        Templates
                     </Link>
                     <span className="mx-1 sm:mx-2 text-secondary">/</span>
                  </li>
                  <li className="flex items-center">
                     <Link href={`/templates/${productType}`} className="text-secondary hover:text-primary">
                        {typeof productType === 'string' ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Category'}
                     </Link>
                     <span className="mx-1 sm:mx-2 text-secondary">/</span>
                  </li>
                  <li className="text-primary font-medium truncate max-w-[150px] sm:max-w-xs">
                     {product.title}
                  </li>
               </ol>
            </nav>

            {/* Product title section - mobile view */}
            <div className="md:hidden mb-4 sm:mb-6">
               <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                  {product.tags && product.tags.length > 0 ? (
                     product.tags.map((tag, index) => (
                        <span key={index} className="bg-glass text-xs py-1 px-2 rounded-full text-primary">
                           {tag}
                        </span>
                     ))
                  ) : (
                     <span className="bg-glass text-xs py-1 px-2 rounded-full text-primary">
                        {product.productType}
                     </span>
                  )}
               </div>
               <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1 sm:mb-2">{product.title}</h1>
               <p className="text-base sm:text-lg text-secondary">{product.subTitle}</p>
            </div>

            <div className="grid md:grid-cols-7 gap-4 sm:gap-6 md:gap-8">
               {/* Image Column - 3/7 width on desktop */}
               <div className="md:col-span-3">
                  {/* Image Slider Component */}
                  <ProductImageGallery images={product.images} />

                  {/* Mobile view - Tab navigation for content sections */}
                  <div className="md:hidden mb-4 sm:mb-6">
                     <div className="flex border-b border-theme">
                        <button
                           className={`py-2 px-3 sm:px-4 text-sm sm:text-base font-medium ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}
                           onClick={() => setActiveTab('description')}
                        >
                           Description
                        </button>
                        <button
                           className={`py-2 px-3 sm:px-4 text-sm sm:text-base font-medium ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}
                           onClick={() => setActiveTab('reviews')}
                        >
                           Reviews
                        </button>
                     </div>
                  </div>

                  {/* Mobile pricing card component */}
                  <div className="md:hidden mb-4 sm:mb-6">
                     <ProductPriceDetails
                        product={product}
                        originalPrice={product.price}
                        discountedPrice={discountedPrice}
                        formattedOriginalPrice={formattedPrice}
                        formattedDiscountedPrice={formattedDiscountedPrice}
                        isOfferActive={isOfferActive}
                        statusColorClass={statusColorClass}
                        isInCart={isInCart}
                        currentUser={currentUser ?? { id: '', cart: { id: '', products: [] } }}
                        isAuthLoading={isAuthLoading}
                        refreshCurrentUser={refreshCurrentUser}
                        isMobile={true}
                     />
                  </div>
               </div>

               {/* Product Details Column - 4/7 width on desktop */}
               <div className="md:col-span-4">
                  {/* Title Section - desktop only (hidden on mobile) */}
                  <div className="hidden md:block mb-6">
                     <div className="flex flex-wrap gap-2 mb-2">
                        {product.tags && product.tags.length > 0 ? (
                           product.tags.map((tag, index) => (
                              <span key={index} className="bg-glass text-sm py-1 px-3 rounded-full text-primary">
                                 {tag}
                              </span>
                           ))
                        ) : (
                           <span className="bg-glass text-sm py-1 px-3 rounded-full text-primary">
                              {product.productType}
                           </span>
                        )}
                     </div>
                     <h1 className="text-xl lg:text-2xl font-bold text-primary mb-2">{product.title}</h1>
                     <p className="text-lg lg:text-md text-secondary">{product.subTitle}</p>
                  </div>

                  <div className="w-full h-fit flex">
                     {/* Pricing Section Component for Desktop */}
                     <ProductPriceDetails
                        product={product}
                        originalPrice={product.price}
                        discountedPrice={discountedPrice}
                        formattedOriginalPrice={formattedPrice}
                        formattedDiscountedPrice={formattedDiscountedPrice}
                        isOfferActive={isOfferActive}
                        statusColorClass={statusColorClass}
                        isInCart={isInCart}
                        currentUser={currentUser ?? { id: '', cart: { id: '', products: [] } }}
                        isAuthLoading={isAuthLoading}
                        refreshCurrentUser={refreshCurrentUser}
                        isMobile={false}
                     />
                  </div>
               </div>
            </div>

            <div className={`md:col-span-4 mt-8 ${activeTab !== 'description' && 'hidden md:block'}`}>
               <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">About This Template</h2>
               <p className="text-secondary text-sm sm:text-base mb-4 md:mb-6">{product.productAbout}</p>

               <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Technology Stack</h3>
               <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 md:mb-6">
                  {product.technologyStack && product.technologyStack.length > 0 ? (
                     product.technologyStack.map((tech: string, index: number) => (
                        <span key={index} className="bg-accent px-2 py-1 rounded-full text-xs sm:text-sm">
                           {tech}
                        </span>
                     ))
                  ) : (
                     <span className="text-secondary">No technology information available</span>
                  )}
               </div>

               <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 md:mb-6">
                  <div className="bg-background-secondary px-3 py-2 rounded-md">
                     <span className="text-xs sm:text-sm text-secondary">Type</span>
                     <p className="font-medium text-sm sm:text-base">{product.productType}</p>
                  </div>
                  <div className="bg-background-secondary px-3 py-2 rounded-md">
                     <span className="text-xs sm:text-sm text-secondary">Age</span>
                     <p className="font-medium text-sm sm:text-base">{product.websiteAge} day{product.websiteAge !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="bg-background-secondary px-3 py-2 rounded-md">
                     <span className="text-xs sm:text-sm text-secondary">Sales</span>
                     <p className="font-medium text-sm sm:text-base">{product.totalSold} sold</p>
                  </div>
               </div>

               {product.liveLink && (
                  <div className="mb-6 md:mb-8">
                     <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Live Preview</h3>
                     <a
                        href={product.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary inline-flex items-center text-sm hover:bg-opacity-90 transition-all py-2"
                     >
                        <span>View Live Demo</span>
                     </a>
                  </div>
               )}
            </div>

            {/* Reviews Section Component */}
            <div className={`mt-6 sm:mt-8 ${activeTab !== 'reviews' && 'hidden md:block'}`}>
               <ProductReviews
                  slug={slug as string}
               />
            </div>
         </div>
      </div>
   )
}

export default ProductDetailsPage