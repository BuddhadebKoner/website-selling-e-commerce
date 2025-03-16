"use client"

import React, { useState } from 'react';
import FormField from '../shared/FormField';

export interface ProductData {
   slug: string;
   title: string;
   subTitle: string;
   liveLink: string;
   productType: string;
   productAbout: string;
   tags: string[];
   _tagsInput: string;
   price: string;
   websiteAge: string;
   bannerImageUrl: string;
   bannerImageID: string;
   technologyStack: string;
}

const initialProductData: ProductData = {
   slug: 'sample-product',
   title: 'Sample Product',
   subTitle: 'An example product',
   liveLink: 'https://example.com',
   productType: 'website',
   productAbout: 'This is a sample product for demonstration purposes.',
   tags: ['sample', 'demo'],
   _tagsInput: 'sample, demo',
   price: '99.99',
   websiteAge: '1',
   bannerImageUrl: 'https://via.placeholder.com/300x100',
   bannerImageID: 'banner123',
   technologyStack: 'React, Node.js, MongoDB',
};

const UpdateProductForm = () => {
   const [formData, setFormData] = useState<ProductData>(initialProductData);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitSuccess, setSubmitSuccess] = useState(false);
   const [errors, setErrors] = useState({
      slug: '',
      title: '',
      price: '',
      bannerImageUrl: '',
   });

   const handleInputChange = (
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

   const handleTagsChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => {
      const value = e.target.value;
      setFormData((prev) => ({
         ...prev,
         _tagsInput: value,
         tags: value.split(',').map((tag) => tag.trim()).filter((tag) => tag !== ''),
      }));
      setErrors((prev) => ({
         ...prev,
         tags: '',
      }));
   };

   const validateForm = () => {
      const newErrors = {
         slug: '',
         title: '',
         price: '',
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

      if (!formData.price) {
         newErrors.price = 'Price is required';
         isValid = false;
      } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
         newErrors.price = 'Price must be a valid positive number';
         isValid = false;
      }

      if (!formData.bannerImageUrl) {
         newErrors.bannerImageUrl = 'Banner image URL is required';
         isValid = false;
      }

      setErrors(newErrors);
      return isValid;
   };

   const handleUpdateProduct = (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Create a shallow copy of changed fields
      const changes: Partial<ProductData> = {};
      Object.keys(formData).forEach((key) => {
         const typedKey = key as keyof ProductData;
         if (formData[typedKey] !== initialProductData[typedKey]) {
            changes[typedKey] = formData[typedKey] as any;
         }
      });

      if (Object.keys(changes).length === 0) {
         console.log('No changes made. Nothing to update.');
         return;
      }

      setIsSubmitting(true);
      // Simulate a PUT update call
      setTimeout(() => {
         // Transform changed fields if necessary
         if (changes.price) changes.price = changes.price.toString();
         if (changes.websiteAge) changes.websiteAge = changes.websiteAge.toString();
         if (changes.technologyStack && typeof changes.technologyStack === 'string') {
            changes.technologyStack = changes.technologyStack.split(',').map((tech) => tech.trim()).join(', ');
         }
         console.log('Changed fields:', changes);
         setSubmitSuccess(true);
         setIsSubmitting(false);
      }, 1500);
   };


   // Field configurations for rendering form fields using FormField component
   const inputFields = [
      { id: 'title', label: 'Title', name: 'title', required: true, type: 'text', placeholder: 'Product title', error: errors.title },
      { id: 'slug', label: 'Slug', name: 'slug', required: true, type: 'text', placeholder: 'product-url-slug', error: errors.slug },
      { id: 'subTitle', label: 'Subtitle', name: 'subTitle', required: false, type: 'text', placeholder: 'Sub Heading', error: '' },
      { id: 'liveLink', label: 'Live Link', name: 'liveLink', required: false, type: 'url', placeholder: 'https://example.com', error: '' },
      { id: 'price', label: 'Price', name: 'price', required: true, type: 'number', placeholder: '49.99', error: errors.price },
      { id: 'websiteAge', label: 'Website Age', name: 'websiteAge', required: false, type: 'text', placeholder: '2 years', error: '' },
      { id: 'technologyStack', label: 'Technology Stack', name: 'technologyStack', required: false, type: 'text', placeholder: 'React, Node.js, MongoDB', error: '' },
   ];

   return (
      <div className="space-y-6 animate-fadeIn">
         <h2 className="text-2xl font-bold">Update Product</h2>
         {submitSuccess && (
            <div className="bg-accent-green-light text-primary p-4 rounded mb-6 animate-slideDown">
               Product updated successfully!
            </div>
         )}

         <form onSubmit={handleUpdateProduct} className="bg-box p-6 rounded-lg border border-theme">
            <div className="grid md:grid-cols-2 gap-6">
               {inputFields.map((field) => (
                  <FormField
                     key={field.id}
                     htmlFor={field.id}
                     labelText={field.label}
                     name={field.name}
                     isRequired={field.required}
                     inputType={field.type}
                     value={(formData as any)[field.name]}
                     onChange={handleInputChange}
                     placeholder={field.placeholder}
                     error={field.error}
                  />
               ))}
               <FormField
                  fieldType="select"
                  htmlFor="productType"
                  labelText="Product Type"
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  options={[
                     { value: '', label: 'Select product type' },
                     { value: 'website', label: 'Website' },
                     { value: 'template', label: 'Template' },
                     { value: 'plugin', label: 'Plugin' },
                     { value: 'service', label: 'Service' },
                  ]}
               />
            </div>

            {/* Tags */}
            <div className="form-group mt-6">
               <FormField
                  htmlFor="tags"
                  labelText="Tags"
                  name="tags"
                  value={formData._tagsInput}
                  onChange={handleTagsChange}
                  placeholder="Separate tags with commas: e-commerce, responsive, portfolio"
               />
               {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                     {formData.tags.map((tag, index) => (
                        <span key={index} className="bg-accent-green text-primary px-2 py-1 rounded">
                           {tag}
                        </span>
                     ))}
                  </div>
               )}
            </div>

            {/* Product Description */}
            <FormField
               fieldType="textarea"
               htmlFor="productAbout"
               labelText="Product Description"
               name="productAbout"
               isRequired={false}
               value={formData.productAbout}
               onChange={handleInputChange}
               inputClass="form-input min-h-[150px]"
               placeholder="Detailed description of the product..."
            />

            {/* Banner Image */}
            <div className="form-group mt-6">
               <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                     htmlFor="bannerImageUrl"
                     labelText="Banner Image URL"
                     name="bannerImageUrl"
                     isRequired={true}
                     inputType="text"
                     value={formData.bannerImageUrl}
                     onChange={handleInputChange}
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
                     onChange={handleInputChange}
                     placeholder="Banner Image ID"
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
                           onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
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
                     'Update Product'
                  )}
               </button>
            </div>
         </form>
      </div>
   );
};

export default UpdateProductForm;
