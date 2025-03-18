"use client";

import React, { useState } from 'react';
import FormField from '../shared/FormField';
import { createCategory } from '@/endpoints/admin.api';
import { toast } from 'react-toastify';

export interface CategoriesData {
   slug: string;
   title: string;
   subTitle: string;
   description: string;
   bannerImageUrl: string;
   bannerImageID: string;
   isFeatured: boolean;
   products: string[];
}

const CategoryForm = () => {
   const [formData, setFormData] = useState<CategoriesData>({
      slug: '',
      title: '',
      subTitle: '',
      description: '',
      bannerImageUrl: '',
      bannerImageID: '',
      isFeatured: false,
      products: [],
   });

   // New state for direct input of product IDs
   const [productIdsInput, setProductIdsInput] = useState('');

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [apiError, setApiError] = useState('');
   const [errors, setErrors] = useState({
      slug: '',
      title: '',
      subTitle: '',
      description: '',
      bannerImageUrl: '',
      bannerImageID: '',
   });

   // Handle general input field changes
   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value,
      }));
      if (name in errors) {
         setErrors(prev => ({
            ...prev,
            [name]: '',
         }));
      }
   };

   // Handle changes for product IDs input field
   const handleProductIdsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setProductIdsInput(value);
      // Split comma-separated values, trim, and filter out empty strings
      const productIds = value.split(',').map(id => id.trim()).filter(id => id !== '');

      // Add validation to ensure each ID is a valid ObjectId format
      const validProductIds = productIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id));

      setFormData(prev => ({
         ...prev,
         products: validProductIds,
      }));

      // If there are invalid IDs, show a warning
      if (validProductIds.length !== productIds.length) {
         setApiError('Some product IDs are not in a valid format and were removed.');
      } else {
         setApiError('');
      }
   };

   // Handle featured checkbox
   const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
         ...prev,
         isFeatured: e.target.checked,
      }));
   };

   // Validate required fields
   const validateForm = () => {
      const newErrors = {
         slug: '',
         title: '',
         subTitle: '',
         description: '',
         bannerImageUrl: '',
         bannerImageID: '',
      };
      let isValid = true;
      if (!formData.title.trim()) {
         newErrors.title = 'Title is required';
         isValid = false;
      }
      if (!formData.subTitle.trim()) {
         newErrors.subTitle = 'Subtitle is required';
         isValid = false;
      }
      if (!formData.description.trim()) {
         newErrors.description = 'Description is required';
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
      if (!formData.bannerImageID) {
         newErrors.bannerImageID = 'Banner image ID is required';
         isValid = false;
      }
      setErrors(newErrors);
      return isValid;
   };

   // Handle form submission
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);
      setApiError('');

      try {
         console.log('Submitting form:', formData);
         const res = await createCategory(formData);
         console.log('Response:', res);

         if (res.success === false) {
            toast.error(res.error || 'Failed to create category');
            return;
         }

         toast.success('Category created successfully');

         // Optional: Reset form after successful submission
         // setFormData({ ...initialFormData });
         // setProductIdsInput('');
      } catch (error) {
         console.error('Error creating category:', error);
         toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
         setIsSubmitting(false);
      }
   };

   // Field configurations for the text inputs
   const inputFields = [
      { id: 'title', label: 'Title', name: 'title', required: true, type: 'text', placeholder: 'Category title', error: errors.title },
      { id: 'slug', label: 'Slug', name: 'slug', required: true, type: 'text', placeholder: 'category-url-slug', error: errors.slug },
      { id: 'subTitle', label: 'Subtitle', name: 'subTitle', required: true, type: 'text', placeholder: 'Category subtitle', error: errors.subTitle },
   ];

   return (
      <div className="space-y-6 animate-fadeIn">
         <h2 className="text-2xl font-bold">Create New Category</h2>
         {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
               {apiError}
            </div>
         )}
         <form onSubmit={handleSubmit} className="bg-box p-6 rounded-lg border border-theme">
            <div className="grid md:grid-cols-2 gap-6">
               {inputFields.map(field => (
                  <FormField
                     key={field.id}
                     htmlFor={field.id}
                     labelText={field.label}
                     name={field.name}
                     isRequired={field.required}
                     inputType={field.type}
                     value={(formData as any)[field.name]}
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
               error={errors.description}
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
                     isRequired={true}
                     inputType="text"
                     value={formData.bannerImageID}
                     onChange={handleChange}
                     placeholder="Banner Image ID"
                     error={errors.bannerImageID}
                  />
               </div>
               {formData.bannerImageUrl && (
                  <div className="mt-4">
                     <p className="text-secondary text-sm mb-2">Banner Preview:</p>
                     <div className="bg-background-secondary border border-theme p-2 rounded">
                        <img
                           src={formData.bannerImageUrl}
                           alt="Banner preview"
                           className="h-32 object-cover rounded"
                           onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              setApiError('Error loading image. Please check the URL.');
                           }}
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
                     checked={formData.isFeatured}
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
                           <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                           ></circle>
                           <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                           ></path>
                        </svg>
                        Processing...
                     </>
                  ) : (
                     'Add Category'
                  )}
               </button>
            </div>
         </form>
      </div>
   );
};

export default CategoryForm;