'use client'

import React, { useState, useEffect } from 'react';
import {
  useGetAllProducts,
  useGetProductsByType
} from "@/lib/react-query/queriesAndMutation";
import { useInView } from 'react-intersection-observer';
import { LoaderCircle } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { FilterOption, productTypeFilters } from '@/config/filterOptions';

export interface IProducts {
  _id: string;
  slug: string;
  title: string;
  subTitle?: string;
  productType: string;
  status: string;
  price: number;
  bannerImageUrl: string;
  totalSold: number;
  is_featured: boolean;
  technologyStack?: string[];
}

export default function Page() {
  const { ref, inView } = useInView();

  // Initialize state for active filter
  const [activeFilter, setActiveFilter] = useState<FilterOption>({
    type: 'all',
    value: 'all',
    label: 'All Products'
  });

  // All filter options including "All Products"
  const allFilters: FilterOption[] = [
    { type: 'all', value: 'all', label: 'All Products' },
    ...productTypeFilters
  ];

  // Determine which query to use based on the active filter
  const allProductsQuery = useGetAllProducts();
  const typeFilteredQuery = useGetProductsByType(
    activeFilter.type === 'productType' ? activeFilter.value : '',
    10,
    { enabled: activeFilter.type === 'productType' }
  );

  // Select the active query based on filter type
  const activeQuery = activeFilter.type === 'all' ? allProductsQuery : typeFilteredQuery;

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
  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
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
        </div>

        <div className="flex overflow-x-auto whitespace-nowrap space-x-2 mb-4">
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

      <div className="flex overflow-x-auto whitespace-nowrap space-x-2 py-5">
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

      <div className="rounded-lg overflow-hidden">
        {hasProducts ? (
          <div className="flex flex-col space-y-4 p-4">
            {data?.pages.map((page) =>
              (page.data || []).map((product: IProducts) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  slug={product.slug}
                  title={product.title}
                  subTitle={product.subTitle}
                  price={product.price}
                  status={product.status}
                  bannerImageUrl={product.bannerImageUrl}
                  productType={product.productType}
                  totalSold={product.totalSold}
                  is_featured={product.is_featured}
                  technologyStack={product.technologyStack}
                />
              ))
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg mb-2">No products found for the {activeFilter.label} filter</p>
            <p className="text-gray-500 mb-6">Try selecting a different filter or add a new product</p>
          </div>
        )}
      </div>

      {/* Infinite scroll loading indicators */}
      {hasProducts && (
        <>
          <div ref={ref} className="h-10" />
          {isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
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
