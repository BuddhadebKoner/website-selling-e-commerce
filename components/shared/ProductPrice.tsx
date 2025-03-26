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
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  let discountedPrice = originalPrice;
  let saveAmount = 0;
  let savePercentage = 0;

  if (OfferStatus !== "unavailable" && discount > 0) {
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

      {OfferStatus === "live" && isOfferActive && (
        <div className="flex items-center mt-1">
          <span className="w-2 h-2 rounded-full bg-accent-green mr-2 status-live-icon"></span>
          <span className="text-xs text-accent-green">Offer Active</span>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;