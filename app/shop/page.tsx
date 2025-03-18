"use client";
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useGetAllProducts } from '@/lib/react-query/queriesAndMutation';
import { ProductsGrid } from '@/components/ProductsGrid';

const ProductsPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllProducts();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Extract all products from all pages
  const allProducts = data?.pages?.flatMap(page => page.data) || [];
  const hasProducts = allProducts.length > 0;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-accent-red">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-glass sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasProducts ? (
          <>
            <ProductsGrid products={allProducts} isLoading={isLoading} />

            {/* Loading indicator and infinite scroll trigger */}
            <div ref={ref} className="py-4 text-center">
              {isFetchingNextPage && (
                <p className="text-secondary">Loading more products...</p>
              )}
              {!hasNextPage && allProducts.length > 0 && (
                <p className="text-secondary">No more products to load</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            {isLoading ? (
              <p className="text-secondary">Loading products...</p>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-secondary mb-4">No products found</p>
                <button className="btn btn-primary">Add Your First Product</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;