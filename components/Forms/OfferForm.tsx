"use client";

import React, { useEffect, useState, useMemo } from 'react';
import FormField from '../shared/FormField';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import { addOffer } from '@/endpoints/admin.api';
import { OfferData } from '@/types/interfaces';



const OfferForm = ({ action, offerData }: {
  action: string;
  offerData: OfferData | null;
}) => {
  const params = useParams();
  const productId = params.id as string;

  const initialOfferData = useMemo(() => ({
    OfferStatus: 'unavailable',
    OfferType: 'percentage',
    discount: 0,
    offerStartDate: new Date().toISOString().split('T')[0],
    offerEndDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    productId: productId || '',
  }), [productId]);

  const [formData, setFormData] = useState<OfferData>(initialOfferData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    OfferStatus: '',
    OfferType: '',
    discount: '',
    offerStartDate: '',
    offerEndDate: '',
  });

  const router = useRouter();

  useEffect(() => {
    if (action === "update" && offerData) {
      setFormData({
        ...offerData,
        productId: productId || offerData.productId
      });
    } else if (productId) {
      setFormData({
        ...initialOfferData,
        productId
      });
    }
  }, [initialOfferData, action, offerData, productId]);

  // Handle input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' ? parseFloat(value) : value,
    }));

    // Clear error when field changes
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      OfferStatus: '',
      OfferType: '',
      discount: '',
      offerStartDate: '',
      offerEndDate: '',
    };
    let isValid = true;

    if (!formData.OfferStatus) {
      newErrors.OfferStatus = 'Offer status is required';
      isValid = false;
    }

    if (!formData.OfferType) {
      newErrors.OfferType = 'Offer type is required';
      isValid = false;
    }

    if (formData.discount <= 0) {
      newErrors.discount = 'Discount must be greater than zero';
      isValid = false;
    }

    if (formData.OfferType === 'percentage' && formData.discount > 100) {
      newErrors.discount = 'Percentage discount cannot exceed 100%';
      isValid = false;
    }

    if (!formData.offerStartDate) {
      newErrors.offerStartDate = 'Start date is required';
      isValid = false;
    }

    if (!formData.offerEndDate) {
      newErrors.offerEndDate = 'End date is required';
      isValid = false;
    }

    // Check if end date is after start date
    if (formData.offerStartDate && formData.offerEndDate) {
      const startDate = new Date(formData.offerStartDate);
      const endDate = new Date(formData.offerEndDate);

      if (endDate <= startDate) {
        newErrors.offerEndDate = 'End date must be after start date';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Log form data including the product ID
    console.log('Form submission data:', {
      ...formData,
      productId: productId || formData.productId
    });

    setIsSubmitting(true);

    try {
      if (action === "add") {
        await handleAddOffer();
        toast.success('Offer added successfully');
      } else {
        // Placeholder for update API call
        toast.success('Offer updated successfully');
      }
    } catch (error) {
      console.error('Error with offer:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // for add new offer 
  const handleAddOffer = async () => {
    try {
      const result = await addOffer({
        offer: {
          ...formData,
          productSlug: formData.productId || ''
        }
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to add offer');
      }
    } catch (error) {
      console.error('Error with offer:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold">
        {action === "add" ? "Create New Offer" : "Update Offer"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-box p-6 rounded-lg border border-theme">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Offer Status */}
          <div className="form-group">
            <label htmlFor="OfferStatus" className="block text-sm font-medium mb-1">
              Offer Status <span className="text-red-500">*</span>
            </label>
            <select
              id="OfferStatus"
              name="OfferStatus"
              value={formData.OfferStatus}
              onChange={handleChange}
              className="form-select w-full rounded border border-gray-300 p-2"
            >
              <option value="live">Live</option>
              <option value="unavailable">Unavailable</option>
            </select>
            {errors.OfferStatus && (
              <p className="text-red-500 text-sm mt-1">{errors.OfferStatus}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Set to &quot;Live&quot; to activate the offer or &quot;Unavailable&quot; to disable it
            </p>
          </div>

          {/* Offer Type */}
          <div className="form-group">
            <label htmlFor="OfferType" className="block text-sm font-medium mb-1">
              Offer Type <span className="text-red-500">*</span>
            </label>
            <select
              id="OfferType"
              name="OfferType"
              value={formData.OfferType}
              onChange={handleChange}
              className="form-select w-full rounded border border-gray-300 p-2"
            >
              <option value="percentage">Percentage Discount</option>
              <option value="fixed">Fixed Amount Discount</option>
            </select>
            {errors.OfferType && (
              <p className="text-red-500 text-sm mt-1">{errors.OfferType}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              &quot;Percentage&quot; for % off, &quot;Fixed&quot; for specific amount off
            </p>
          </div>
        </div>

        {/* Discount */}
        <div className="mt-6">
          <FormField
            htmlFor="discount"
            labelText={`Discount Value (${formData.OfferType === 'percentage' ? '%' : '$'})`}
            name="discount"
            isRequired={true}
            inputType="number"
            value={formData.discount.toString()}
            onChange={handleChange}
            placeholder={formData.OfferType === 'percentage' ? 'Enter percentage (e.g. 15)' : 'Enter amount'}
            error={errors.discount}
          />
          <p className="text-gray-500 text-xs mt-1">
            {formData.OfferType === 'percentage'
              ? 'Enter a percentage value between 1-100%'
              : 'Enter the fixed amount to discount from the product price'}
          </p>
        </div>

        {/* Date Range */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <FormField
              htmlFor="offerStartDate"
              labelText="Start Date"
              name="offerStartDate"
              isRequired={true}
              inputType="date"
              value={formData.offerStartDate}
              onChange={handleChange}
              error={errors.offerStartDate}
            />
            <p className="text-gray-500 text-xs mt-1">
              When the offer will become active
            </p>
          </div>

          <div>
            <FormField
              htmlFor="offerEndDate"
              labelText="End Date"
              name="offerEndDate"
              isRequired={true}
              inputType="date"
              value={formData.offerEndDate}
              onChange={handleChange}
              error={errors.offerEndDate}
            />
            <p className="text-gray-500 text-xs mt-1">
              When the offer will expire
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary px-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {
              isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                action === "add" ? 'Add Offer' : 'Update Offer'
              )
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferForm;