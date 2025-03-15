type AuthCheckParams = {
   clerkId: string;
   email: string;
   fullName: string;
};

type AuthCheckResponse = {
   message?: string;
   user?: any;
   error?: string;
};

export async function isAuthCheck({ clerkId, email, fullName }: AuthCheckParams): Promise<AuthCheckResponse> {
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