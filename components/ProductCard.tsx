'use client'

import Image from 'next/image'
import React from 'react'

export function ProductCard({ name, price, sold, image }:{name: string, price: string, sold: number, image: string}) {
   return (
      <div className="bg-box rounded-lg overflow-hidden border border-theme transition-all hover:shadow-md">
         <div className="aspect-square bg-background-secondary">
            <Image
               src={image}
               alt={name}
               width={300}
               height={300}
               className="w-full h-full object-cover" />
         </div>
         <div className="p-4">
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center justify-between mt-2">
               <p className="font-bold text-highlight-primary">{price}</p>
               <p className="text-sm text-secondary">{sold} sold</p>
            </div>
         </div>
      </div>
   )
}