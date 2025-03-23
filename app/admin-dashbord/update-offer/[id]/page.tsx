"use client"
import OfferForm from '@/components/Forms/OfferForm';
import { useGetOfferBySlug } from '@/lib/react-query/queriesAndMutation';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useGetOfferBySlug(slug);

  if (isLoading) return <p>Loading category...</p>;
  if (isError) return <p>Error: {error?.message || "Failed to fetch offer"}</p>;
  if (!data || !data.offer) return <p>No category data found</p>;

  return (
    <OfferForm
      action="update"
      offerData={data.offer}
    />
  );
};

export default Page;