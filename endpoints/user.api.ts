type AuthCheckParams = {
   clerkId: string;
   email: string;
   fullName: string;
};

export async function isAuthCheck({ clerkId, email, fullName }: AuthCheckParams) {
   try {
      const response = await fetch('/api/webhooks/auth/is-auth', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ clerkId, email, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Failed to fetch');
      }

      return data;
   } catch (error) {
      console.error("Error in isAuthCheck:", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
}

export const getAllUsers = async (page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/public/users?page=${page}&limit=${limit}`);
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

export const addToCart = async (productId: string, cartId?: string) => {
   try {
      const response = await fetch('/api/public/users/cart', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ productId, cartId })
      });

      const result = await response.json();

      if (!response.ok) {
         return {
            success: false,
            error: result.error || "Failed to add to cart"
         };
      }

      return result; 
   } catch (error) {
      console.error("Error in addToCart:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Internal Server Error"
      };
   }
};

export const removeFromCart = async (productId: string, cartId?: string) => { 
   try {
      const response = await fetch('/api/public/users/cart/', {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ productId, cartId })
      });

      const result = await response.json();

      if (!response.ok) {
         return {
            success: false,
            error: result.error || "Failed to remove from cart"
         };
      }

      return result;
   } catch (error) {
      console.error("Error in removeFromCart:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Internal Server Error"
      };
   }
};