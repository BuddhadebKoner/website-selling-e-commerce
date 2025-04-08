"use client";

import { useGetCategoryBySlug } from "@/lib/react-query/queriesAndMutation";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { LoaderCircle, Info } from "lucide-react";
import { useParams } from "next/navigation";
import { ProductCardProps } from "@/types/interfaces";

const CategoryPage = () => {
  const { id } = useParams();

  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useGetCategoryBySlug(id as string);

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <LoaderCircle className="animate-spin h-8 w-8 text-highlight-primary" />
        <span className="ml-2 text-secondary">Loading category details...</span>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-accent-red">
          Error loading category
        </h1>
        <p className="text-secondary mt-2">
          {error?.message || "Unable to load this category. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-fit bg-background pb-12 flex flex-col overflow-y-hidden">
      {/* Category Header with Banner Image */}
      <div className="w-full h-64 md:h-80 relative">
        {category.bannerImageUrl ? (
          <Image
            fill
            src={category.bannerImageUrl}
            alt={category.title || "Category image"}
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-background-secondary flex items-center justify-center">
            <Info className="text-secondary mr-2" size={24} />
            <span className="text-secondary">No banner image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto p-8">
            <div className="animate-slideDown">
              {category.isFeatured && (
                <span className="bg-premium-btn-start text-black text-xs px-3 py-1 rounded-full font-medium mb-2 inline-block">
                  Featured Category
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {category.title || "Untitled Category"}
              </h1>
              {category.subTitle && (
                <p className="text-white text-opacity-90 text-lg">
                  {category.subTitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Category Description */}
        {category.description && (
          <div className="mb-8 bg-box p-6 rounded-lg border border-theme animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">About this Category</h2>
            <p className="text-secondary">{category.description}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Products in this Category</h2>
            <span className="text-secondary">
              {category.productsData?.length || 0} products found
            </span>
          </div>

          {category.productsData && category.productsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.productsData.map((product: ProductCardProps) => (
                <ProductCard key={product._id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-box border border-theme rounded-lg">
              <p className="text-secondary">No products available in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;