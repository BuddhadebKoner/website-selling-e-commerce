'use client'

import React from 'react';
import Link from "next/link";

export interface ICategories {
  _id: string;
  title: string;
  productType: string;
  status: string;
  price: number;
}

export default function page() {
  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   isLoading,
  //   isError
  // } = useGetAllProducts();

  // const { ref, inView } = useInView();

  // React.useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error...</div>;


  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Category</h2>
        <Link
          href="/admin-dashbord/add-category"
          className="btn btn-primary text-sm py-1 px-3"
        >
          Add Categories
        </Link>
      </div>

      <div className="bg-box rounded-lg overflow-hidden border border-theme">
        <table className="w-full">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* {data?.pages.map((page) =>
              (page.data || []).map((product: IProducts) => (
                <ProductDataInRow
                  key={product._id}
                  product={product}
                />
              ))
            )} */}
          </tbody>
        </table>
      </div>

      {/* Intersection observer target for infinite scroll */}
      {/* <div ref={ref} className="h-10" />

      {isFetchingNextPage && (
        <div className="text-center">Loading more...</div>
      )}
      {isFetching && !isFetchingNextPage && (
        <div className="text-center">Fetching...</div>
      )} */}
    </div>
  );
}
