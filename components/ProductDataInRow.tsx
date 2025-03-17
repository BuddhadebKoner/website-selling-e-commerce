"use client"

import { updateProductStatus, updateProductType } from '@/endpoints/admin.api'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { LoaderCircle } from 'lucide-react'

const ProductDataInRow = ({ product }: {
   product: {
      _id: string
      slug: string
      title: string
      productType: string
      status: string
      price: number
   }
}) => {
   // Local state to track changes
   const [currentStatus, setCurrentStatus] = useState<string>(product.status);
   const [currentProductType, setCurrentProductType] = useState<string>(product.productType);

   // Loading states
   const [statusLoading, setStatusLoading] = useState(false);
   const [productTypeLoading, setProductTypeLoading] = useState(false);

   // Update local state if product prop changes
   useEffect(() => {
      setCurrentStatus(product.status);
      setCurrentProductType(product.productType);
   }, [product.status, product.productType]);

   // Handle status change
   const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value;
      if (newStatus !== currentStatus) {
         try {
            setStatusLoading(true);
            setCurrentStatus(newStatus);

            const res = await updateProductStatus(product._id, newStatus);

            if (res.error) {
               // Revert to previous status if there was an error
               setCurrentStatus(product.status);
               toast.error(`Failed to update status: ${res.error}`);
            } else {
               toast.success(`Product status updated to ${newStatus}`);
            }
         } catch (error) {
            // Revert to previous status on exception
            setCurrentStatus(product.status);
            toast.error('An unexpected error occurred while updating status');
            console.error('Status update error:', error);
         } finally {
            setStatusLoading(false);
         }
      }
   };

   // Handle product type change
   const handleProductTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newProductType = e.target.value;
      if (newProductType !== currentProductType) {
         try {
            setProductTypeLoading(true);
            setCurrentProductType(newProductType);

            const res = await updateProductType(product._id, newProductType);

            if (res.error) {
               // Revert to previous type if there was an error
               setCurrentProductType(product.productType);
               toast.error(`Failed to update product type: ${res.error}`);
            } else {
               toast.success(`Product type updated to ${newProductType}`);
            }
         } catch (error) {
            // Revert to previous type on exception
            setCurrentProductType(product.productType);
            toast.error('An unexpected error occurred while updating product type');
            console.error('Product type update error:', error);
         } finally {
            setProductTypeLoading(false);
         }
      }
   };

   return (
      <tr key={product._id} className="border-t border-theme">
         <td className="px-4 py-3">
            <div className="flex items-center">
               <span className="font-medium">{product.title}</span>
            </div>
         </td>
         <td className="px-4 py-3">
            <div className="relative">
               <select
                  value={currentProductType}
                  onChange={handleProductTypeChange}
                  disabled={productTypeLoading}
                  className={`inline-block px-2 py-1 rounded text-sm bg-transparent border border-gray-300 focus:outline-none ${productTypeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
               >
                  <option value="E-commerce">E-commerce</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Business">Business</option>
                  <option value="Personal Blog">Personal Blog</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Educational">Educational</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Job Portal">Job Portal</option>
                  <option value="Social Network">Social Network</option>
               </select>
               {productTypeLoading && (
                  <LoaderCircle className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
               )}
            </div>
         </td>
         <td className="px-4 py-3">
            <div className="relative">
               <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  disabled={statusLoading}
                  className={`inline-block px-2 py-1 rounded text-sm bg-transparent border border-gray-300 focus:outline-none ${statusLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
               >
                  <option value="live">Live</option>
                  <option value="delay">Delay</option>
                  <option value="unabaliable">Unavailable</option>
               </select>
               {statusLoading && (
                  <LoaderCircle className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
               )}
            </div>
         </td>
         <td className="px-4 py-3 font-medium">${product.price}</td>
         <td className="px-4 py-3">
            <div className="flex space-x-2">
               <Link
                  href={`/admin-dashbord/update-product/${product.slug}`}
                  className="btn btn-secondary text-sm py-1 px-3"
               >
                  Edit
               </Link>
               <button className="btn btn-secondary text-sm py-1 px-3 text-accent-red">
                  Delete
               </button>
            </div>
         </td>
      </tr>
   )
}

export default ProductDataInRow