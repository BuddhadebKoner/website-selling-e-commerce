'use client'

import React, { useState } from 'react';
import {
  useGetAllProducts,
  useGetProductsByStatus,
  useGetProductsByType
} from "@/lib/react-query/queriesAndMutation";
import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import ProductDataInRow from '@/components/ProductDataInRow';
import { LoaderCircle } from 'lucide-react';
import { IProducts } from '@/types/interfaces';



type FilterOption = {
  type: 'status' | 'productType' | 'all';
  value: string;
  label: string;
}

export default function Page() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>({
    type: 'all',
    value: 'all',
    label: 'All Products'
  });
  const { ref, inView } = useInView();

  // Status filter options
  const statusFilters: FilterOption[] = [
    { type: 'status', value: 'live', label: 'Live' },
    { type: 'status', value: 'delay', label: 'Delay' },
    { type: 'status', value: 'unabaliable', label: 'Unavailable' },
  ];

  // Product type filter options
  const productTypeFilters: FilterOption[] = [
    { type: 'productType', value: 'E-commerce', label: 'E-commerce' },
    { type: 'productType', value: 'Portfolio', label: 'Portfolio' },
    { type: 'productType', value: 'Business', label: 'Business' },
    { type: 'productType', value: 'Personal Blog', label: 'Personal Blog' },
    { type: 'productType', value: 'SaaS', label: 'SaaS' },
  ];

  // All filter options including "All Products"
  const allFilters: FilterOption[] = [
    { type: 'all', value: 'all', label: 'All Products' },
    ...statusFilters,
    ...productTypeFilters
  ];

  // Determine which query to use based on the active filter
  const allProductsQuery = useGetAllProducts();
  const statusFilteredQuery = useGetProductsByStatus(
    activeFilter.type === 'status' ? activeFilter.value : '',
    10,
    { enabled: activeFilter.type === 'status' }
  );
  const typeFilteredQuery = useGetProductsByType(
    activeFilter.type === 'productType' ? activeFilter.value : '',
    10,
    { enabled: activeFilter.type === 'productType' }
  );

  // Select the active query based on filter type
  const activeQuery = {
    'all': allProductsQuery,
    'status': statusFilteredQuery,
    'productType': typeFilteredQuery
  }[activeFilter.type];

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

  console.log(data);

  // Handle filter button clicks
  const handleFilterChange = (filter: FilterOption) => {
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

        <div className="flex space-x-2 mb-4 flex-wrap gap-2">
          {allFilters.map((filter) => (
            <button
              key={`${filter.type}-${filter.value}`}
              className={`btn ${activeFilter.value === filter.value ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter.label}
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
        {allFilters.map((filter) => (
          <button
            key={`${filter.type}-${filter.value}`}
            className={`btn ${activeFilter.value === filter.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter.label}
          </button>
        ))}
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
              {data?.pages.map((page) =>
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
            <p className="text-lg mb-2">No products found for the {activeFilter.label} filter</p>
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