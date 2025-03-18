"use client"
import CategoryForm from '@/components/Forms/CategoryForm';
import { useGetCategoryBySlug } from '@/lib/react-query/queriesAndMutation';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useGetCategoryBySlug(slug);

  if (isLoading) return <p>Loading category...</p>;
  if (isError) return <p>Error: {error?.message || "Failed to fetch category"}</p>;
  if (!data || !data.category) return <p>No category data found</p>;

  return (
    <CategoryForm
      action="update"
      categoryData={data.category}
    />
  );
};

export default Page;