import React from 'react';

const ProductPrice = (
  {
    originalPrice,
    OfferStatus,
    OfferType,
    discount,
  }: {
    originalPrice: number,
    OfferStatus: string,
    OfferType: string,
    discount: number,
  }
) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  let discountedPrice = originalPrice;
  let saveAmount = 0;
  let savePercentage = 0;

  if (OfferStatus === "live" && discount > 0) {
    if (OfferType === "percentage") {
      discountedPrice = originalPrice - (originalPrice * (discount / 100));
      savePercentage = discount;
      saveAmount = originalPrice - discountedPrice;
    }
    if (OfferType === "fixed") {
      discountedPrice = originalPrice - discount;
      saveAmount = discount;
      savePercentage = Math.round((discount / originalPrice) * 100);
    }
  }

  const isOfferActive = OfferStatus === "live" && discountedPrice < originalPrice;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        {isOfferActive ? (
          <>
            <span className="text-xl font-bold text-highlight-primary">
              {formatter.format(discountedPrice)}
            </span>
            <span className="text-sm line-through text-secondary">
              {formatter.format(originalPrice)}
            </span>
            <span className="text-xs px-2 py-0.5 bg-accent-green-light text-white rounded-full">
              {savePercentage}% OFF
            </span>
          </>
        ) : (
          <span className="text-xl font-bold">
            {formatter.format(originalPrice)}
          </span>
        )}
      </div>

      {isOfferActive && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-accent-green mr-2 animate-pulse"></span>
            <span className="text-xs text-accent-green">Offer Active</span>
          </div>
          <div className="text-xs text-secondary">
            Save {formatter.format(saveAmount)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;