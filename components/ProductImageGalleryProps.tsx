import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
   images: { imageUrl: string }[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   // Reset image index when images change
   useEffect(() => {
      setCurrentImageIndex(0);
   }, [images]);

   // Navigation for image slider
   const nextImage = () => {
      if (images?.length) {
         setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
         );
      }
   };

   const prevImage = () => {
      if (images?.length) {
         setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
         );
      }
   };

   if (!images || images.length === 0) {
      return null;
   }

   return (
      <div className="mb-4 sm:mb-6">
         <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3 border border-theme">
            <Image
               src={images[currentImageIndex].imageUrl}
               alt={`Product Image ${currentImageIndex + 1}`}
               fill
               className="object-contain"
               priority
            />

            {/* Navigation buttons */}
            <button
               onClick={prevImage}
               className="absolute left-2 top-1/2 -translate-y-1/2 bg-background bg-opacity-70 p-1 sm:p-2 rounded-full shadow-lg hover:bg-opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-highlight-primary"
               aria-label="Previous image"
            >
               <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
            </button>

            <button
               onClick={nextImage}
               className="absolute right-2 top-1/2 -translate-y-1/2 bg-background bg-opacity-70 p-1 sm:p-2 rounded-full shadow-lg hover:bg-opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-highlight-primary"
               aria-label="Next image"
            >
               <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
            </button>
         </div>

         {/* Thumbnail navigation - scrollable on mobile */}
         <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((image, index) => (
               <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-12 w-16 sm:h-16 sm:w-24 rounded-md overflow-hidden flex-shrink-0 border ${currentImageIndex === index
                        ? 'border-highlight-primary'
                        : 'border-theme'
                     } focus:outline-none focus:ring-2 focus:ring-highlight-primary transition-all`}
               >
                  <Image
                     src={image.imageUrl}
                     alt={`Thumbnail ${index + 1}`}
                     fill
                     className="object-cover"
                  />
               </button>
            ))}
         </div>
      </div>
   );
};

export default ProductImageGallery;