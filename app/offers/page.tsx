'use client';

import { useEffect, useState } from 'react';

export default function OffersPage() {
  const [offersData, setOffersData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/public/offers');
        const data = await response.json();

        // Log the data to console
        console.log('Offers data:', data);

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch offers');
        }

        setOffersData(data);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="w-full min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Top Offers</h1>

      {isLoading && <p>Loading offers...</p>}

      {error && <p className="text-red-500">Error: {error}</p>}

      {offersData && (
        <div>
          <p>Total Offers: {offersData.totalOffers}</p>
          {/* No cards as requested, just logging to console */}
        </div>
      )}
    </div>
  );
}