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
      <Link href={`/categories/${slug}`}>
         <div className="flex flex-col bg-background-secondary rounded-lg overflow-hidden border border-border hover:shadow-md transition-shadow duration-200 h-full">
            {bannerImageUrl && (
               <div className="relative w-full h-48 overflow-hidden">
                  <Image
                     src={bannerImageUrl}
                     width={500}
                     height={500}
                     alt={title}
                     fill
                     className="object-cover"
                  />
                  {isFeatured && (
                     <div className="absolute top-2 right-2 bg-accent px-2 py-1 rounded text-xs font-medium">
                        Featured
                     </div>
                  )}
               </div>
            )}
            <div className="p-4 flex-grow flex flex-col">
               <h3 className="text-xl font-bold mb-2 line-clamp-1">{title}</h3>
               <p className="text-gray-600 mb-4 line-clamp-2">{subTitle}</p>
               <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm text-gray-500">{productsCount} {productsCount === 1 ? 'product' : 'products'}</span>
                  <span className="text-sm text-primary">View category</span>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default CategoryCard;