"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/Forms/ProductForm";
import { useGetProductBySlug } from "@/lib/react-query/queriesAndMutation";

const Page = () => {
  const { id: slug } = useParams<{ id: string }>();
  console.log("slug", slug);

  const { data: product, isLoading, isError, error } = useGetProductBySlug(slug);
  if (isLoading) return <p>Loading product...</p>;
  if (isError)
    return <p>Error: {error?.message || "Failed to fetch product"}</p>;

  return <ProductForm action="update" productData={product.product} />;
};

export default Page;
