import { OrderCreateData } from "@/types/interfaces";

interface CreateResponse {
   success: boolean;
   order?: any;
   error?: string;
   status?: number;
}

export async function createOrder(order: OrderCreateData): Promise<CreateResponse> {
   try {
      const response = await fetch('/api/public/order/', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(order),
      });

      const data = await response.json();

      if (response.status === 403) {
         return {
            success: false,
            error: data.error || 'Allready Have Pending Orders',
            status: 403,
         };
      }

      if (!response.ok) {
         throw new Error(data.error || 'Failed to create order');
      }

      return data;
   } catch (error) {
      console.error('Error in creating order:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while creating order',
      };
   }
}

export async function getOrderListById(id: string) {
   try {
      const response = await fetch(`/api/public/order/${id}`);
      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Failed to get order');
      }

      return data.orders;
   } catch (error) {
      console.error('Error in getting order:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while getting order',
      };
   }
}

// update payment status 
export async function updatePaymentStatus(id: string, amount: number) {
   try {
      const response = await fetch(`/api/public/order/${id}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || 'Failed to update payment status');
      }

      return data;
   } catch (error) {
      console.error('Error in updating payment status:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while updating payment status',
      };
   }
}