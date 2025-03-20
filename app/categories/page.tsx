"use client";

import React, { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useGetAllCategory } from '@/lib/react-query/queriesAndMutation';
import { useInView } from 'react-intersection-observer';
import CategoryCard from '@/components/CategoryCard';

const AllCategoriesPage = () => {
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
  } = useGetAllCategory(10);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasCategories = data?.pages?.[0]?.data?.length > 0;

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
        <h2 className="text-2xl font-bold">Categories</h2>
        <div className="bg-box rounded-lg overflow-hidden border border-theme p-8 text-center">
          <div className="text-accent-red text-lg mb-2">Error loading categories</div>
          <p className="text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Could not fetch category data. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      {hasCategories ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {data?.pages.map((page) =>
            (page.data || []).map((category: any) => (
              <CategoryCard key={category._id} {...category} />
            ))
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg mb-2">No categories found.</p>
          <p className="text-gray-500 mb-6">Please add some categories.</p>
        </div>
      )}
      {/* Infinite scroll indicator */}
      {hasCategories && (
        <>
          <div ref={ref} className="h-10" />
          {isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-2">Loading more categories...</p>
            </div>
          )}
        </>
      )}
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
};

export default AllCategoriesPage;