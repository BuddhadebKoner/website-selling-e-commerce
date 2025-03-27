import { CategoriesData, Offer, ProductData } from "@/types/interfaces";

// Define the product type to match your form data structure
export type CreateResponse = {
   success?: boolean;
   product?: any;
   error?: string;
};

export async function createProduct(product: ProductData): Promise<CreateResponse> {
   try {
      const response = await fetch('/api/admin/products', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Failed to create product');
      }

      return {
         success: true,
         product: data,
      };
   } catch (error) {
      console.error('Error in creating product:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while creating product',
      };
   }
}

export async function updateProduct(product: Partial<ProductData>) {
   try {
      if (!product.slug) {
         throw new Error('Product slug is required for updates');
      }

      const response = await fetch(`/api/admin/products/${product.slug}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(product),
      });

      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || 'Failed to update product');
      }

      return { success: true, product: data };
   } catch (error) {
      console.error('Error in updating product:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while updating product'
      };
   }
}

// endpoints/admin.api.ts
export const updateProductStatus = async (productId: string, status: string) => {
   try {
      const response = await fetch(`/api/admin/products/update-status`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id: productId, status }),
      });
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to update status");
      }
      return result;
   } catch (error) {
      console.error("Failed to update product status", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const updateProductType = async (productId: string, productType: string) => {
   try {
      const response = await fetch(`/api/admin/products/type-update`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id: productId, productType }),
      });
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to update product type");
      }
      return result;
   } catch (error) {
      console.error("Failed to update product type", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

// create category
export async function createCategory(category: CategoriesData): Promise<CreateResponse> {
   try {
      const response = await fetch('/api/admin/category', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(category),
      });

      // Attempt to parse JSON even if the response is not ok
      const data = await response.json();

      if (!response.ok) {
         // Throw a specific error based on the returned error message, if available.
         throw new Error(data.error || 'Failed to create category');
      }

      return data;
   } catch (error) {
      console.error('Error in creating category:', error);
      // Return a well-defined error structure
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while creating category',
      };
   }
}

// update category
export async function updateCategory(category: Partial<CategoriesData>) {
   try {
      if (!category.slug) {
         throw new Error('Category slug is required for updates');
      }

      const response = await fetch(`/api/admin/category/${category.slug}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(category),
      });

      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || 'Failed to update category');
      }

      return { success: true, category: data };
   } catch (error) {
      console.error('Error in updating category:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while updating category'
      };
   }
}

// add new offer
export async function addOffer({ offer }: {
   offer: {
      OfferStatus: string;
      OfferType: string;
      discount: number;
      offerStartDate: string;
      offerEndDate: string;
      productSlug: string;
   }
}) {
   try {
      if (!offer.productSlug) {
         throw new Error('Product slug is required for offer creation');
      }

      const response = await fetch(`/api/admin/offer/${offer.productSlug}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(offer),
      });

      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || 'Failed to create/update offer');
      }

      return { success: true, offer: data };
   } catch (error) {
      console.error('Error in creating/updating offer:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while processing offer'
      };
   }
}

// get offer by slug
export async function getOffer(slug: string) {
   try {
      const response = await fetch(`/api/admin/offer/${slug}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
         }
      });

      if (response.status === 204) {
         return {
            success: true,
            offer: {
               OfferStatus: "unavailable",
               OfferType: "percentage",
               discount: 0,
               offerStartDate: new Date().toISOString().split('T')[0],
               offerEndDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
               productId: slug
            }
         };
      }

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Failed to fetch offer');
      }

      return {
         success: true,
         offer: data.offer
      };
   } catch (error) {
      console.error('Error in fetching offer:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while fetching offer'
      };
   }
}