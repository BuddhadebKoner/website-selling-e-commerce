// Define the product type to match your form data structure
type ProductData = {
   slug: string;
   title: string;
   subTitle?: string;
   liveLink?: string;
   productType?: string;
   productAbout?: string;
   tags: string[];
   price: number;
   websiteAge?: number;
   images: { imageUrl: string; imageId: string }[];
   bannerImageUrl: string;
   bannerImageID: string;
   technologyStack: string[];
};

// Response type for better TypeScript support
type CreateProductResponse = {
   success?: boolean;
   product?: any;
   error?: string;
};

/**
 * Creates a new product by sending data to the API
 * @param product The product data to be created
 * @returns Response with success status or error message
 */
export async function createProduct(product: ProductData): Promise<CreateProductResponse> {
   try {
      const response = await fetch('/api/admin/products/create-product', {
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
         product: data
      };
   } catch (error) {
      console.error("Error in creating product:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Unknown error occurred while creating product"
      };
   }
}

export const getAllUsers = async (page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/admin/user?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }

      return {
         data: result.data,
         currentPage: result.pagination.currentPage,
         totalPages: result.pagination.totalPages
      };
   } catch (error) {
      console.error("Failed to get users", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};