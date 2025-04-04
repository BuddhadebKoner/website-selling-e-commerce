"use client";

import React, { useEffect, useState } from 'react';
import FormField from '../shared/FormField';
import { createCategory, updateCategory } from '@/endpoints/admin.api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CategoriesData } from '@/types/interfaces';
import Image from 'next/image';
import ProductInput from '../shared/ProductInput';

const CategoryForm = ({ action, categoryData }: {
   action: string;
   categoryData: CategoriesData | "";
}) => {
   const initialCategoryData: CategoriesData = {
      slug: '',
      title: '',
      subTitle: '',
      description: '',
      bannerImageUrl: '',
      bannerImageID: '',
      isFeatured: false,
      products: [],
   };

   const [formData, setFormData] = useState<CategoriesData>(initialCategoryData);
   const [originalData, setOriginalData] = useState<CategoriesData>(initialCategoryData);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [apiError, setApiError] = useState('');

   const router = useRouter();

   useEffect(() => {
      if (action === "update" && categoryData) {
         const formattedData = {
            slug: categoryData.slug,
            title: categoryData.title,
            subTitle: categoryData.subTitle,
            description: categoryData.description,
            bannerImageUrl: categoryData.bannerImageUrl,
            bannerImageID: categoryData.bannerImageID,
            isFeatured: categoryData.isFeatured,
            products: categoryData.products || [],
         };

         setFormData(formattedData);
         setOriginalData(formattedData);
      }
   }, [action, categoryData]);

   const [errors, setErrors] = useState({
      slug: '',
      title: '',
      subTitle: '',
      description: '',
      bannerImageUrl: '',
      bannerImageID: '',
      products: '',
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

   // Handle product IDs changes from ProductInput component
   const handleProductsChange = (products: string[]) => {
      setFormData(prev => ({
         ...prev,
         products,
      }));

      // Clear any product-related errors
      if (errors.products) {
         setErrors(prev => ({
            ...prev,
            products: '',
         }));
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
         products: '',
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

      // Validate products
      const invalidProductIds = formData.products.filter(id => !/^[0-9a-fA-F]{24}$/.test(id));
      if (invalidProductIds.length > 0) {
         newErrors.products = `Invalid product IDs: ${invalidProductIds.join(', ')}. IDs must be 24 character hex strings.`;
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

      if (action === "add") {
         await handleCreateCategory();
      } else if (action === "update") {
         await handleUpdateCategory();
      }
   };

   const handleCreateCategory = async () => {
      try {
         const res = await createCategory(formData);
         if (!res) {
            toast.success('Category added successfully');
            setFormData(initialCategoryData);
         }

         // reset
         setFormData(initialCategoryData);
         router.push('/admin-dashbord/categories');
         toast.success('Category added successfully');
      } catch (error) {
         console.error(error);
         toast.error('An error occurred. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleUpdateCategory = async () => {
      // create a shallow copy of changed fields
      const changes: Partial<CategoriesData> = { slug: formData.slug }; 

      // check for changes
      if (originalData.slug !== formData.slug) {
         changes.slug = formData.slug;
      }
      if (originalData.title !== formData.title) {
         changes.title = formData.title;
      }
      if (originalData.subTitle !== formData.subTitle) {
         changes.subTitle = formData.subTitle;
      }
      if (originalData.description !== formData.description) {
         changes.description = formData.description;
      }
      if (originalData.bannerImageUrl !== formData.bannerImageUrl) {
         changes.bannerImageUrl = formData.bannerImageUrl;
      }
      if (originalData.bannerImageID !== formData.bannerImageID) {
         changes.bannerImageID = formData.bannerImageID;
      }
      if (originalData.isFeatured !== formData.isFeatured) {
         changes.isFeatured = formData.isFeatured;
      }

      // Compare products arrays carefully
      const originalProductsStr = JSON.stringify(originalData.products.sort());
      const newProductsStr = JSON.stringify(formData.products.sort());

      if (originalProductsStr !== newProductsStr) {
         changes.products = formData.products;
      }

      // if no changes
      if (Object.keys(changes).length <= 1) {
         toast.info('No changes were made');
         setIsSubmitting(false);
         return;
      }

      // update category
      try {
         const res = await updateCategory(changes);
         if (res.success) {
            toast.success('Category updated successfully');
            router.push('/admin-dashbord/categories');
         }
         else {
            toast.error('An error occurred while updating the category. Please try again.');
         }
      } catch (error) {
         console.error('Error updating category:', error);
         toast.error('An error occurred while updating the category. Please try again.');
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
         <h2 className="text-2xl font-bold">
            {action === "add" ? "Create New Category" : "Update Category"}
         </h2>
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
                     value={formData[field.name as keyof CategoriesData] as string}
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
                        <Image
                           src={formData.bannerImageUrl}
                           width={600}
                           height={300}
                           alt="Banner preview"
                           className="h-32 object-cover rounded w-full"
                           onError={(e) => {
                              // Better error handling
                              const target = e.currentTarget;
                              target.onerror = null; // Prevent infinite loop
                              target.src = "/placeholder-image.jpg"; // Replace with your placeholder image
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

            {/* Product IDs Input Section - New Component Integration */}
            <div className="form-group mt-6">
               <ProductInput
                  value={formData.products}
                  onChange={handleProductsChange}
                  error={errors.products}
               />
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
               <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary px-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
               >
                  {
                     isSubmitting ? (
                        'processing...'
                     ) : (
                        action === "add" ? 'Add Category' : 'Update Category'
                     )
                  }
               </button>
            </div>
         </form>
      </div>
   );
};

export default CategoryForm;