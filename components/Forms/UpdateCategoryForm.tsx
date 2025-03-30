"use client"

import React, { useState } from 'react';
import FormField from '../shared/FormField';
import { CategoriesData } from '@/types/interfaces';
import Image from 'next/image';

const initialCategoryData: CategoriesData = {
  slug: 'sample-category',
  title: 'Sample Category',
  subTitle: 'Category Subtitle',
  description: 'This is a sample description for the category.',
  bannerImageUrl: 'https://via.placeholder.com/300x100',
  bannerImageID: 'banner-cat-001',
  isFeatured: true,
  products: ['67d59018587ff89b697c8d8f', '67d59018587ff89b697c8d90'],
};

const UpdateCategoryForm = () => {
  // Prepopulate form with initial category data
  const [formData, setFormData] = useState<CategoriesData>(initialCategoryData);
  // For managing the product IDs input as a comma-separated string
  const [productIdsInput, setProductIdsInput] = useState<string>(
    initialCategoryData.products.join(', ')
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({
    slug: '',
    title: '',
    bannerImageUrl: '',
  });

  // Handle general input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle product IDs input changes
  const handleProductIdsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setProductIdsInput(value);
    // Split input by commas, trim, and remove empty values
    const ids = value.split(',').map((id) => id.trim()).filter((id) => id);
    setFormData((prev) => ({
      ...prev,
      products: ids,
    }));
  };

  // Handle featured checkbox change
  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isFeatured: e.target.checked ? true : false,
    }));
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors = {
      slug: '',
      title: '',
      bannerImageUrl: '',
    };
    let isValid = true;
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
      isValid = false;
    }
    if (!formData.bannerImageUrl) {
      newErrors.bannerImageUrl = 'Banner image URL is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Update operation: create a shallow copy of only the changed fields and log them
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const changes: Partial<Record<keyof CategoriesData, string | string[]>> = {};
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof CategoriesData;
      const current =
        Array.isArray(formData[typedKey])
          ? JSON.stringify(formData[typedKey])
          : formData[typedKey];
      const initial =
        Array.isArray(initialCategoryData[typedKey])
          ? JSON.stringify(initialCategoryData[typedKey])
          : initialCategoryData[typedKey];
      if (current !== initial) {
        if (typeof formData[typedKey] === 'string' || Array.isArray(formData[typedKey])) {
          changes[typedKey] = formData[typedKey];
        }
      }
    });

    if (Object.keys(changes).length === 0) {
      console.log('No changes made. Nothing to update.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Changed fields:', changes);
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  // Field configurations for basic text inputs
  const inputFields = [
    {
      id: 'title',
      label: 'Title',
      name: 'title',
      required: true,
      type: 'text',
      placeholder: 'Category title',
      error: errors.title,
    },
    {
      id: 'slug',
      label: 'Slug',
      name: 'slug',
      required: true,
      type: 'text',
      placeholder: 'category-url-slug',
      error: errors.slug,
    },
    {
      id: 'subTitle',
      label: 'Subtitle',
      name: 'subTitle',
      required: true,
      type: 'text',
      placeholder: 'Category subtitle',
      error: '',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold">Update Category</h2>
      {submitSuccess && (
        <div className="bg-accent-green-light text-primary p-4 rounded mb-6 animate-slideDown">
          Category updated successfully!
        </div>
      )}
      <form onSubmit={handleUpdateCategory} className="bg-box p-6 rounded-lg border border-theme">
        <div className="grid md:grid-cols-2 gap-6">
          {inputFields.map((field) => (
            <FormField
              key={field.id}
              htmlFor={field.id}
              labelText={field.label}
              name={field.name}
              isRequired={field.required}
              inputType={field.type}
              value={formData[field.name as keyof CategoriesData]}
              onChange={handleChange}
              placeholder={field.placeholder}
              error={field.error}
            />
          ))}
        </div>

        <FormField
          fieldType="textarea"
          htmlFor="description"
          labelText="Description"
          name="description"
          isRequired={true}
          value={formData.description}
          onChange={handleChange}
          inputClass="form-input min-h-[150px]"
          placeholder="Category description"
        />

        {/* Banner Image Section */}
        <div className="form-group mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              htmlFor="bannerImageUrl"
              labelText="Banner Image URL"
              name="bannerImageUrl"
              isRequired={true}
              inputType="text"
              value={formData.bannerImageUrl}
              onChange={handleChange}
              placeholder="Banner Image URL"
              error={errors.bannerImageUrl}
            />
            <FormField
              htmlFor="bannerImageID"
              labelText="Banner Image ID"
              name="bannerImageID"
              isRequired={false}
              inputType="text"
              value={formData.bannerImageID}
              onChange={handleChange}
              placeholder="Banner Image ID"
            />
          </div>
          {formData.bannerImageUrl && (
            <div className="mt-4">
              <p className="text-secondary text-sm mb-2">Banner Preview:</p>
              <div className="bg-background-secondary border border-theme p-2 rounded">
                <Image
                  src={formData.bannerImageUrl}
                  width={300}
                  height={100}
                  alt="Banner preview"
                  className="h-32 object-cover rounded"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Featured Category */}
        <div className="form-group mt-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured === true}
              onChange={handleFeaturedChange}
              className="h-4 w-4"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              Featured Category
            </label>
          </div>
        </div>

        {/* Product IDs Input Section */}
        <div className="form-group mt-6">
          <FormField
            htmlFor="productIds"
            labelText="Product IDs"
            name="productIds"
            isRequired={false}
            inputType="text"
            value={productIdsInput}
            onChange={handleProductIdsChange}
            placeholder="Enter product IDs separated by commas"
          />
          {formData.products.length > 0 && (
            <div className="mt-2">
              <p className="text-secondary text-sm">Product IDs:</p>
              <div className="flex flex-wrap gap-2">
                {formData.products.map((id, index) => (
                  <span key={index} className="bg-accent-green text-primary px-2 py-1 rounded">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary px-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Update Category'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategoryForm;
