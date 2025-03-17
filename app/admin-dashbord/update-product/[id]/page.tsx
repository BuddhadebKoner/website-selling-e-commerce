"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/Forms/ProductForm";
import { getProductBySlug } from "@/endpoints/products";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      console.log("slug", id);
      const res = await getProductBySlug(id);
      if (res.error) {
        console.error(res.error);
        return;
      }
      setProduct(res.product);
    }

    fetchProduct();
  }, [id]);

  return (
    <ProductForm
      action="update"
      productData={product}
    />
  );
};

export default Page;
