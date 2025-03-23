'use client'

import React from 'react';
import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import { IOffer } from '@/types/interfaces';
import { useGetAllOffers } from '@/lib/react-query/queriesAndMutation';
import OfferDataRow from '@/components/OfferDataRow';

export default function Page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetAllOffers();

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;


  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offer</h2>
        <Link
          href="/admin-dashbord/add-offer"
          className="btn btn-primary text-sm py-1 px-3"
        >
          Add Offer
        </Link>
      </div>

      <div className="bg-box rounded-lg overflow-hidden border border-theme">
        <table className="w-full">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium ">Offer Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium ">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium ">Product </th>
              <th className="px-4 py-3 text-left text-sm font-medium ">Start Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium ">End Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium ">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.pages.map((page) =>
              (page.data || []).map((offer: IOffer) => (
                <OfferDataRow
                  key={offer.offerName}
                  offer={offer}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Intersection observer target for infinite scroll */}
      <div ref={ref} className="h-10" />

      {isFetchingNextPage && (
        <div className="text-center">Loading more...</div>
      )}
      {isFetching && !isFetchingNextPage && (
        <div className="text-center">Fetching...</div>
      )}
    </div>
  );
}
