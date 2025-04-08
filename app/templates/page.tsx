"use client";

import React, { useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useGetAllProducts } from '@/lib/react-query/queriesAndMutation';
import { LoaderCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { ProductCardProps } from '@/types/interfaces';

const AllProductsPage = () => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetAllProducts();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  console.log('AllProductsPage data:', data);

  // Determine if there are any products
  const hasProducts = data?.pages?.[0]?.data?.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn w-full h-full flex items-center justify-center">
        <LoaderCircle className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="bg-box rounded-lg overflow-hidden border border-theme p-8 text-center">
          <div className="text-accent-red text-lg mb-2">Error loading products</div>
          <p className="text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Could not fetch product data. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      {hasProducts ? (
        <div className="w-full h-fit flex flex-col gap-10">
          {data?.pages.map((page) =>
            (page.data || []).map((product: ProductCardProps) => (
              <ProductCard key={product._id} {...product} />
            ))
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg mb-2">No products found.</p>
          <p className="text-gray-500 mb-6">Try adding new products.</p>
        </div>
      )}

      {/* Infinite scroll indicator */}
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

      {isFetching && !isFetchingNextPage && (
        <div className="fixed bottom-4 right-4 bg-background-secondary px-4 py-2 rounded-md shadow-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
            <span>Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProductsPage;