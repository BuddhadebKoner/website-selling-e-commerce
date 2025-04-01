"use client"

import { useGetAllOffers } from '@/lib/react-query/queriesAndMutation'
import React, { useEffect, useRef } from 'react'
import { CalendarDays, Percent, ShoppingBag, Tag } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/formatDate'

export const OffersPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetAllOffers();

  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Calculate savings amount
  const calculateSavings = (price: number, discountPercentage: number): string => {
    return (price * discountPercentage / 100).toFixed(2);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-pulse w-12 h-12 rounded-full bg-accent-alpha mb-4"></div>
          <p className="text-secondary">Loading offers...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-accent-red text-white p-3 rounded-full mb-4">!</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Offers</h2>
          <p className="text-secondary mb-4">{error?.message || "Something went wrong. Please try again."}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const allOffers = data?.pages.flatMap(page => page.offers) || [];
  const isEmpty = allOffers.length === 0;

  return (
    <div className="container mx-auto py-8 px-4">

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-accent-yellow p-3 rounded-full mb-4">
            <Tag className="w-6 h-6 text-background-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Active Offers</h2>
          <p className="text-secondary mb-4">Check back soon for new deals and promotions!</p>
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allOffers.map((offer) => {
            const savingsAmount = calculateSavings(offer.price, offer.discount);
            const finalPrice = offer.price - Number(savingsAmount);

            return (
              <div
                key={offer._id}
                className="premium-card hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{offer.productType}</h2>
                    <div className="bg-accent-green text-background-primary px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Percent className="w-3 h-3 mr-1" />
                      {offer.discount} OFF
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-secondary">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span>Start : {formatDate(offer.offerStartDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span>Ends : {formatDate(offer.offerEndDate)}</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <span className="text-secondary text-sm">Original Price:</span>
                        <span className="ml-auto text-secondary line-through">₹{offer.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="text-accent-green text-sm">Discount:</span>
                        <span className="ml-auto text-accent-green">-₹{savingsAmount}</span>
                      </div>
                      <div className="flex items-center font-bold mt-2 text-highlight border-t border-border-color pt-2">
                        <span>Your Price:</span>
                        <span className="ml-auto text-xl">₹{finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/templates/${offer.productType}/${offer.slug}`} className="w-full btn btn-primary flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop Now</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasNextPage && (
        <div
          ref={observerRef}
          className="flex justify-center items-center py-8"
        >
          {isFetchingNextPage ? (
            <div className="animate-pulse flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-alpha"></div>
              <div className="w-3 h-3 rounded-full bg-accent-alpha animation-delay-200"></div>
              <div className="w-3 h-3 rounded-full bg-accent-alpha animation-delay-400"></div>
            </div>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="btn btn-secondary"
            >
              Load More Offers
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Add default export for Next.js page convention
export default OffersPage;
