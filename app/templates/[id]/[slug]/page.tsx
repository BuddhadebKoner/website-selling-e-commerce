"use client"

import { useGetProductBySlug } from '@/lib/react-query/queriesAndMutation';
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserAuthentication } from '@/context/AuthProvider';
import { ExternalLink, LoaderCircle } from 'lucide-react';
import ProductImageGallery from '@/components/ProductImageGalleryProps';
import ProductPriceDetails from '@/components/ProductPriceDetails';
import ProductReviews from '@/components/ProductReviews';

const ProductDetailsPage = () => {
   const { slug } = useParams();
   const {
      data,
      isLoading,
      isError,
   } = useGetProductBySlug(slug as string);

   interface Product {
      _id: string;
      title: string;
      subTitle: string;
      price: number;
      tags: string[];
      images: { imageUrl: string }[];
      productAbout: string;
      technologyStack: string[];
      productType: string;
      websiteAge: number;
      liveLink?: string;
      status: string;
   }

   const product: Product | undefined = data?.product;
   const [activeTab, setActiveTab] = useState('description'); // For mobile tabs
   const { currentUser, refreshCurrentUser } = useUserAuthentication();

   // Reset image index when product changes
   useEffect(() => {
      // No longer needed here, moved to ProductImageGallery
   }, [product?._id]);

   // Sample reviews data
   const reviews = [
      {
         id: 1,
         name: "Alex Johnson",
         rating: 5,
         date: "March 15, 2025",
         comment: "This template is exactly what I needed for my portfolio. Easy to customize and looks very professional."
      },
      {
         id: 2,
         name: "Sarah Williams",
         rating: 4,
         date: "March 10, 2025",
         comment: "Great design and well-structured code. I had a small issue with mobile responsiveness but the support team helped me fix it quickly."
      },
      {
         id: 3,
         name: "Michael Chen",
         rating: 5,
         date: "March 5, 2025",
         comment: "Best purchase I've made for my freelance business. The clean design really helps showcase my work effectively."
      }
   ];

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

   if (isError || !product) {
      return (
         <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4">
            <div className="card p-6 sm:p-8 max-w-lg w-full">
               <h2 className="text-xl sm:text-2xl font-bold text-accent-red mb-4">
                  {isError ? "Error Loading Product" : "Product Not Found"}
               </h2>
               <p className="text-secondary mb-6">
                  {isError
                     ? "We couldn't load the product details. Please try again later."
                     : "The product you're looking for doesn't exist or has been removed."
                  }
               </p>
               <Link href="/templates" className="btn btn-primary w-full text-center">
                  {isError ? "Return to Templates" : "Browse Templates"}
               </Link>
            </div>
         </div>
      )
   }

   // Format price
   const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
   }).format(product.price);

   const mainPriceBeforeDiscount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
   }).format(product.price + 1000);

   // Check if product is in user's cart
   const isInCart = currentUser?.cart?.products?.some(cartProduct => cartProduct._id === product._id) ?? false;

   // Status color mapping
   const statusColorClass = {
      'active': 'bg-accent-green bg-opacity-10 text-accent-green',
      'delay': 'bg-accent-yellow bg-opacity-10 text-accent-yellow',
      'inactive': 'bg-accent-red bg-opacity-10 text-accent-red'
   }[product.status] || 'bg-background-secondary text-secondary';

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
                  <li className="text-primary font-medium truncate max-w-[150px] sm:max-w-xs">
                     {product.title}
                  </li>
               </ol>
            </nav>

            {/* Product title section - mobile view */}
            <div className="md:hidden mb-4 sm:mb-6">
               <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                  {product.tags.map((tag, index) => (
                     <span key={index} className="bg-glass text-xs py-1 px-2 rounded-full text-primary">
                        {tag}
                     </span>
                  ))}
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
                        formattedPrice={formattedPrice}
                        mainPriceBeforeDiscount={mainPriceBeforeDiscount}
                        statusColorClass={statusColorClass}
                        isInCart={isInCart}
                        currentUser={currentUser}
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
                        {product.tags.map((tag, index) => (
                           <span key={index} className="bg-glass text-sm py-1 px-3 rounded-full text-primary">
                              {tag}
                           </span>
                        ))}
                     </div>
                     <h1 className="text-xl lg:text-2xl font-bold text-primary mb-2">{product.title}</h1>
                     <p className="text-lg lg:text-md text-secondary">{product.subTitle}</p>
                  </div>

                  <div className="grid md:grid-cols-7 gap-6 md:gap-8">
                     {/* Pricing Section Component for Desktop */}
                     <div className="hidden md:block md:col-span-3">
                        <ProductPriceDetails
                           product={product}
                           formattedPrice={formattedPrice}
                           mainPriceBeforeDiscount={mainPriceBeforeDiscount}
                           statusColorClass={statusColorClass}
                           isInCart={isInCart}
                           currentUser={currentUser}
                           refreshCurrentUser={refreshCurrentUser}
                           isMobile={false}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className={`md:col-span-4 ${activeTab !== 'description' && 'hidden md:block'}`}>
               <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">About This Template</h2>
               <p className="text-secondary text-sm sm:text-base mb-4 md:mb-6">{product.productAbout}</p>

               <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Technology Stack</h3>
               <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 md:mb-6">
                  {product.technologyStack.map((tech: string, index: number) => (
                     <span key={index} className="bg-accent px-2 py-1 rounded-full text-xs sm:text-sm">
                        {tech}
                     </span>
                  ))}
               </div>

               <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 md:mb-6">
                  <div className="bg-background-secondary px-3 py-2 rounded-md">
                     <span className="text-xs sm:text-sm text-secondary">Type</span>
                     <p className="font-medium text-sm sm:text-base">{product.productType}</p>
                  </div>
                  <div className="bg-background-secondary px-3 py-2 rounded-md">
                     <span className="text-xs sm:text-sm text-secondary">Age</span>
                     <p className="font-medium text-sm sm:text-base">{product.websiteAge} year{product.websiteAge !== 1 ? 's' : ''}</p>
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
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                     </a>
                  </div>
               )}
            </div>

            {/* Reviews Section Component */}
            <div className={`mt-6 sm:mt-8 ${activeTab !== 'reviews' && 'hidden md:block'}`}>
               <ProductReviews reviews={reviews} />
            </div>
         </div>
      </div>
   )
}

export default ProductDetailsPage