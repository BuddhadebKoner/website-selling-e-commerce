'use client'
import React, { useState } from 'react';
import {
  useGetAllProducts,
  useGetLiveProducts,
  useGetDelayedProducts,
  useGetUnavailableProducts
} from "@/lib/react-query/queriesAndMutation";
import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import ProductDataInRow from '@/components/ProductDataInRow';
import { LoaderCircle } from 'lucide-react';

export interface IProducts {
  _id: string;
  slug: string;
  title: string;
  productType: string;
  status: string;
  price: number;
}

type FilterType = 'all' | 'live' | 'delay' | 'unavailable';

export default function Page() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { ref, inView } = useInView();

  // Query hooks for different product statuses
  const allProductsQuery = useGetAllProducts();
  const liveProductsQuery = useGetLiveProducts();
  const delayedProductsQuery = useGetDelayedProducts();
  const unavailableProductsQuery = useGetUnavailableProducts();

  // Determine which query to use based on the active filter
  const activeQuery = {
    'all': allProductsQuery,
    'live': liveProductsQuery,
    'delay': delayedProductsQuery,
    'unavailable': unavailableProductsQuery
  }[activeFilter];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = activeQuery;

  // Handle filter button clicks
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Check if there are products in the data
  const hasProducts = data?.pages[0]?.data?.length > 0;

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn w-full h-full flex items-start justify-center">
        <LoaderCircle className='animate-spin w-8 h-8' />
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Products</h2>
          <Link
            href="/admin-dashbord/add-product"
            className="btn btn-primary text-sm py-1 px-3"
          >
            Add Product
          </Link>
        </div>

        <div className="flex space-x-2 mb-4">
          {['all', 'live', 'delay', 'unavailable'].map((filter) => (
            <button
              key={filter}
              className={`btn ${activeFilter === filter ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleFilterChange(filter as FilterType)}
            >
              {filter === 'all' ? 'All Products' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-box rounded-lg overflow-hidden border border-theme p-8 text-center">
          <div className="text-accent-red text-lg mb-2">
            Error loading products
          </div>
          <p className="text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Could not fetch product data. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link
          href="/admin-dashbord/add-product"
          className="btn btn-primary text-sm py-1 px-3"
        >
          Add Product
        </Link>
      </div>

      <div className="flex space-x-2 mb-4 flex-wrap gap-2">
        <button
          className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleFilterChange('all')}
        >
          All Products
        </button>
        <button
          className={`btn ${activeFilter === 'live' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleFilterChange('live')}
        >
          Live
        </button>
        <button
          className={`btn ${activeFilter === 'delay' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleFilterChange('delay')}
        >
          Delay
        </button>
        <button
          className={`btn ${activeFilter === 'unavailable' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleFilterChange('unavailable')}
        >
          Unavailable
        </button>
      </div>

      <div className="bg-box rounded-lg overflow-hidden border border-theme">
        {hasProducts ? (
          <table className="w-full">
            <thead className="bg-background-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Product Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.pages.map((page, i) =>
                (page.data || []).map((product: IProducts) => (
                  <ProductDataInRow
                    key={product._id}
                    product={product}
                  />
                ))
              )}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg mb-2">No products found for the {activeFilter === 'all' ? 'selected filter' : activeFilter} filter</p>
            <p className="text-gray-500 mb-6">Try selecting a different filter or add a new product</p>
            <Link
              href="/admin-dashbord/add-product"
              className="btn btn-primary py-2 px-4"
            >
              Add Your First Product
            </Link>
          </div>
        )}
      </div>

      {/* Infinite scroll loading indicators */}
      {hasProducts && (
        <>
          <div ref={ref} className="h-10" />
          {isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2">Loading more products...</p>
            </div>
          )}
        </>
      )}

      {/* Global fetching indicator */}
      {isFetching && !isFetchingNextPage && (
        <div className="fixed bottom-4 right-4 bg-background-secondary px-4 py-2 rounded-md shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
            <span>Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}