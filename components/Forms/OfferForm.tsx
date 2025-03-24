"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FormField from '../shared/FormField';
import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ProductInput from '../shared/ProductInput';
import { createOffer, updateOffer } from '@/endpoints/admin.api';
import { IOffer } from '@/types/interfaces';
import { toast } from 'react-toastify';


// Custom DateField component with improved styling
const DateField = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  error
}: {
  label: string;
  name: string;
  value: Date;
  onChange: (date: Date) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label} {required && <span className="text-accent-red">*</span>}
    </label>
    <DatePicker
      id={name}
      selected={value}
      onChange={(date: Date | null) => date && onChange(date)}
      className="form-input w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
      dateFormat="MMMM d, yyyy"
      placeholderText={placeholder}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
    {error && <p className="accent-red text-sm mt-1">{error}</p>}
  </div>
);

// Toggle component with better styling
const ToggleField = ({
  label,
  name,
  checked,
  onChange
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label flex items-center">
      <span className="mr-3">{label}</span>
      <input
        type="checkbox"
        id={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
    </label>
  </div>
);


function OfferForm({ action, offerData }: {
  action: "create" | "update",
  offerData?: any
}) {
  // Initial offer data with sensible defaults
  const initialOfferData: IOffer = {
    offerName: "",
    description: "",
    status: "inactive",
    type: "percentage",
    discount: 0,
    isFeatured: false,
    offerStartDate: new Date(),
    offerEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    products: []
  };

  const route = useRouter();

  // Main form state
  const [formData, setFormData] = useState<IOffer>(initialOfferData);

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formTouched, setFormTouched] = useState(false);

  const router = useRouter();

  // Load offer data if editing
  useEffect(() => {
    if (action === "update" && offerData) {
      // Format the data correctly for the form
      const formattedData: IOffer = {
        offerName: offerData.offerName || "",
        description: offerData.description || "",
        status: offerData.status || "inactive",
        type: offerData.type || "percentage",
        discount: offerData.discount || 0,
        isFeatured: offerData.isFeatured || false,
        offerStartDate: offerData.offerStartDate ? new Date(offerData.offerStartDate) : new Date(),
        offerEndDate: offerData.offerEndDate ? new Date(offerData.offerEndDate) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        products: Array.isArray(offerData.products) ? offerData.products : [],
      };
      setFormData(formattedData);
    }
  }, [action, offerData]);

  // Form change handlers with automatic form touch tracking
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormTouched(true);

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);

    if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, [name]: numValue }));
      setFormTouched(true);

      // Clear error for this field
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleDateChange = (name: string) => (date: Date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
    setFormTouched(true);

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    setFormTouched(true);
  };

  const handleProductChange = (products: string[]) => {
    setFormData(prev => ({ ...prev, products }));
    setFormTouched(true);

    // Clear error for this field
    if (errors.products) {
      setErrors(prev => ({ ...prev, products: "" }));
    }
  };

  // Simple form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Required field validation
    if (!formData.offerName.trim()) {
      newErrors.offerName = "Offer name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (formData.discount <= 0) {
      newErrors.discount = "Discount must be greater than 0";
      isValid = false;
    } else if (formData.type === "percentage" && formData.discount > 100) {
      newErrors.discount = "Percentage discount cannot exceed 100%";
      isValid = false;
    }

    // Date validation
    if (formData.offerEndDate <= formData.offerStartDate) {
      newErrors.offerEndDate = "End date must be after start date";
      isValid = false;
    }

    // Products validation (just check if any exist)
    if (formData.products.length === 0) {
      newErrors.products = "At least one product must be added";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (action === "create") {
        await handleCreateOffer();
      } else if (action === "update") {
        await handleUpdateOffer();
      }
    } catch (error) {
      console.error("Failed to create/update offer:", error);
      toast.error("Failed to create/update offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOffer = async () => {
    try {
      const response = await createOffer(formData);

      if (response.success) {
        toast.success(response.offer.message || "Offer created successfully");
      } else {
        toast.error(response.error || "Failed to create offer");
      }

    } catch (error) {
      console.error("Failed to create offer:", error);
      toast.error("Failed to create offer");
    }
  };

  const handleUpdateOffer = async () => {
    setIsSubmitting(true);

    try {
      // Properly track changes with fixed variable name
      const changes: Partial<IOffer> = {};

      // Check each field individually with proper comparison
      if (offerData.offerName !== formData.offerName) {
        changes.offerName = formData.offerName;
      }

      if (offerData.description !== formData.description) {
        changes.description = formData.description;
      }

      if (offerData.status !== formData.status) {
        changes.status = formData.status;
      }

      if (offerData.type !== formData.type) {
        changes.type = formData.type;
      }

      if (offerData.discount !== formData.discount) {
        changes.discount = formData.discount;
      }

      if (offerData.isFeatured !== formData.isFeatured) {
        changes.isFeatured = formData.isFeatured;
      }

      // Handle date comparisons properly
      const startDateChanged = new Date(offerData.offerStartDate).getTime() !==
        new Date(formData.offerStartDate).getTime();
      if (startDateChanged) {
        changes.offerStartDate = formData.offerStartDate;
      }

      const endDateChanged = new Date(offerData.offerEndDate).getTime() !==
        new Date(formData.offerEndDate).getTime();
      if (endDateChanged) {
        changes.offerEndDate = formData.offerEndDate;
      }

      // Compare products arrays properly - only do this once
      const productsChanged = JSON.stringify([...offerData.products].sort()) !==
        JSON.stringify([...formData.products].sort());
      if (productsChanged) {
        changes.products = formData.products;
      }

      // Check if no meaningful changes were made (account for ID always being present)
      if (Object.keys(changes).length <= 1) {
        toast.info('No changes were made to the offer');
        setIsSubmitting(false);
        return;
      }

      // Proceed with update
      const response = await updateOffer(changes);

      if (response.success) {
        toast.success("Offer updated successfully");
        setFormTouched(false);
        router.back();
      } else {
        toast.error(response.error || "Failed to update offer");
      }
    } catch (error: any) {
      console.error("Failed to update offer:", error);
      toast.error(error.message || "An unexpected error occurred while updating the offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (formTouched && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return;
    }
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-box p-6 rounded-lg border border-theme shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        {action === "create" ? "Create New Offer" : `Edit Offer : ${formData.offerName}`}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Offer Name */}
          {
            action === "create" && (
              <div className="form-group">
                <FormField
                  fieldType="input"
                  htmlFor="offerName"
                  labelText="Offer Name"
                  name="offerName"
                  inputType="text"
                  value={formData.offerName}
                  onChange={handleInputChange}
                  isRequired={true}
                  placeholder="Enter offer name"
                />
                {errors.offerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.offerName}</p>
                )}
              </div>
            )
          }

          {/* Description */}
          <div className="form-group">
            <FormField
              fieldType="textarea"
              htmlFor="description"
              labelText="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              isRequired={true}
              placeholder="Enter offer description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Offer Type */}
          <div className="form-group">
            <FormField
              fieldType="select"
              htmlFor="type"
              labelText="Offer Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              isRequired={true}
              options={[
                { value: "percentage", label: "Percentage" },
                { value: "fixed", label: "Fixed Amount" }
              ]}
            />
          </div>

          {/* Discount */}
          <div className="form-group">
            <FormField
              fieldType="input"
              htmlFor="discount"
              labelText={`Discount ${formData.type === "percentage" ? "(%)" : "($)"}`}
              name="discount"
              inputType="number"
              value={formData.discount.toString()}
              onChange={handleNumericChange}
              isRequired={true}
              placeholder={`Enter discount ${formData.type === "percentage" ? "percentage" : "amount"}`}
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Status */}
          <div className="form-group">
            <FormField
              fieldType="select"
              htmlFor="status"
              labelText="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              isRequired={true}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "expired", label: "Expired" }
              ]}
            />
          </div>

          {/* Featured Toggle */}
          {
            action === "create" && (
              <ToggleField
                label="Is Featured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleToggleChange("isFeatured")}
              />
            )
          }

          {/* Start Date */}
          <DateField
            label="Offer Start Date"
            name="offerStartDate"
            value={formData.offerStartDate}
            onChange={handleDateChange("offerStartDate")}
            required={true}
            placeholder="Select start date"
            error={errors.offerStartDate}
          />

          {/* End Date */}
          <DateField
            label="Offer End Date"
            name="offerEndDate"
            value={formData.offerEndDate}
            onChange={handleDateChange("offerEndDate")}
            required={true}
            placeholder="Select end date"
            error={errors.offerEndDate}
          />
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-6">
        <ProductInput
          value={formData.products}
          onChange={handleProductChange}
          error={errors.products}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-secondary text-sm py-2 px-6 rounded-md border border-theme hover:bg-background-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary text-sm py-2 px-6 rounded-md transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Processing...'
            : action === 'update'
              ? 'Update Offer'
              : 'Create Offer'
          }
        </button>
      </div>
    </form>
  );
}

export default OfferForm;