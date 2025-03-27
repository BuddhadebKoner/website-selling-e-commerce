"use client";

import React, { useEffect, useState } from 'react';
import OfferForm from '@/components/Forms/OfferForm';
import { useParams } from 'next/navigation';
import { getOffer } from '@/endpoints/admin.api';
import { LoaderCircle } from 'lucide-react';

const OfferPage = () => {
  const { id } = useParams();
  const [offerData, setOfferData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formAction, setFormAction] = useState("add");

  useEffect(() => {
    const fetchOfferData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const { success, offer } = await getOffer(id as string);

        if (success && offer && offer.OfferStatus === "live") {
          setOfferData(offer);
          setFormAction("update");
        } else {
          // Either offer doesn't exist or is unavailable
          setOfferData(null);
          setFormAction("add");
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
        // If error, default to add form
        setOfferData(null);
        setFormAction("add");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderCircle className='animate-spin' />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <OfferForm
        action={formAction}
        offerData={offerData}
      />
    </div>
  );
};

export default OfferPage;