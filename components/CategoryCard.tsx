import { ICategory } from '@/types/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CategoryCard: React.FC<ICategory> = ({
   title,
   subTitle,
   slug,
   bannerImageUrl,
   isFeatured,
   productsCount = 0
}) => {
   return (
      <div className="group bg-box border border-theme rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full h-full">
         <div className="animate-fadeIn transition-all h-full flex flex-col">
            <div className="relative w-full aspect-[4/3] overflow-hidden">
               {bannerImageUrl ? (
                  <Link href={`/categories/${slug}`} className="block h-full">
                     <Image
                        src={bannerImageUrl}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        alt={title}
                        className="object-cover transition-transform group-hover:scale-105 duration-500"
                        priority
                     />
                  </Link>
               ) : (
                  <div className="h-full w-full bg-background-secondary flex items-center justify-center">
                     <span className="text-secondary text-xs sm:text-sm">No image available</span>
                  </div>
               )}
               {isFeatured && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-accent-green text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-2xs sm:text-xs font-medium shadow-sm">
                     Editor's Choice
                  </div>
               )}
            </div>
            <div className="p-3 sm:p-4 md:p-5 flex-grow flex flex-col">
               <h3 className="text-primary text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-1">{title}</h3>
               {subTitle && (
                  <p className="text-secondary mb-2 sm:mb-4 text-xs sm:text-sm line-clamp-2">{subTitle}</p>
               )}
               <div className="mt-auto pt-2 sm:pt-3 border-t border-theme flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-secondary">
                     {productsCount} {productsCount === 1 ? 'product' : 'products'}
                  </span>
                  <Link href={`/categories/${slug}`} className="text-xs sm:text-sm link-color font-medium hover:link-hover flex items-center">
                     View category
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CategoryCard;