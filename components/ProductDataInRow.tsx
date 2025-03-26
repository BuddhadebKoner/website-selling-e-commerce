"use client"

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { LoaderCircle, Trash2, Edit } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/react-query/queryKeys'
import { updateProductStatus, updateProductType } from '@/endpoints/admin.api'

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
   // Get query client for cache invalidation
   const queryClient = useQueryClient();

   console.log('product:', product);

   // Local state to track changes
   const [currentStatus, setCurrentStatus] = useState<string>(product.status);
   const [currentProductType, setCurrentProductType] = useState<string>(product.productType);

   // Loading states
   const [statusLoading, setStatusLoading] = useState(false);
   const [productTypeLoading, setProductTypeLoading] = useState(false);
   const [deleteLoading, setDeleteLoading] = useState(false);

   // Product type options
   const productTypes = [
      "E-commerce",
      "Portfolio",
      "Business",
      "Personal-Blog",
      "Landing-Page",
      "SaaS",
      "Educational",
      "Real Estate",
      "Job-Portal",
      "Social-Network"
   ];

   // Status options
   const statusOptions = [
      { value: "live", label: "Live" },
      { value: "delay", label: "Delay" },
      { value: "unabaliable", label: "Unavailable" }
   ];

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
            setCurrentStatus(newStatus); // Optimistic update

            const res = await updateProductStatus(product._id, newStatus);

            if (res.error) {
               // Revert to previous status if there was an error
               setCurrentStatus(product.status);
               toast.error(`Failed to update status: ${res.error}`);
            } else {
               toast.success(`Product status updated to ${statusOptions.find(s => s.value === newStatus)?.label || newStatus}`);

               // Invalidate related queries to refresh data
               queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_PRODUCTS] });
               queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS_BY_STATUS] });
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
            setCurrentProductType(newProductType); // Optimistic update

            const res = await updateProductType(product._id, newProductType);

            if (res.error) {
               // Revert to previous type if there was an error
               setCurrentProductType(product.productType);
               toast.error(`Failed to update product type: ${res.error}`);
            } else {
               toast.success(`Product type updated to ${newProductType}`);

               // Invalidate related queries to refresh data
               queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_PRODUCTS] });
               queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS_BY_TYPE] });
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

   // Handle product deletion (placeholder for future implementation)
   const handleDeleteProduct = async () => {
      if (window.confirm(`Are you sure you want to delete ${product.title}?`)) {
         setDeleteLoading(true);

         // Replace with actual delete API call when implemented
         try {
            // const res = await deleteProduct(product._id);
            toast.success(`Product deleted successfully`);

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_PRODUCTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS_BY_STATUS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS_BY_TYPE] });
         } catch (error) {
            toast.error('Failed to delete product');
            console.error('Delete error:', error);
         } finally {
            setDeleteLoading(false);
         }
      }
   };

   return (
      <tr key={product._id} className="border-t border-theme hover:bg-background-secondary/10 transition-colors">
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
                  {productTypes.map(type => (
                     <option key={type} value={type}>{type}</option>
                  ))}
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
                  {statusOptions.map(option => (
                     <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
               </select>
               {statusLoading && (
                  <LoaderCircle className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
               )}
            </div>
         </td>
         <td className="px-4 py-3 font-medium">₹ {product.price.toLocaleString()}</td>
         <td className="px-4 py-3">
            <div className="flex space-x-2">
               <Link
                  href={`/admin-dashbord/update-product/${product.slug}`}
                  className="btn btn-secondary text-sm py-1 px-3 flex items-center"
               >
                  <Edit size={14} className="mr-1" /> Edit
               </Link>
               <button
                  className="btn btn-secondary text-sm py-1 px-3 text-accent-red flex items-center"
                  onClick={handleDeleteProduct}
                  disabled={deleteLoading}
               >
                  {deleteLoading ? (
                     <LoaderCircle size={14} className="mr-1 animate-spin" />
                  ) : (
                     <Trash2 size={14} className="mr-1" />
                  )}
               </button>
            </div>
         </td>
      </tr>
   )
}

export default ProductDataInRow