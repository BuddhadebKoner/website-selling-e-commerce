"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import FormField from '../shared/FormField';
import Image from 'next/image';
import { createProduct, updateProduct } from '@/endpoints/admin.api';
import { ProductData } from '@/types/interfaces';

const ProductForm = ({ action, productData }: { action: string, productData: ProductData }) => {

   const initialProductData: ProductData = {
      slug: '',
      title: '',
      subTitle: '',
      liveLink: '',
      productType: '',
      productAbout: '',
      tags: [],
      _tagsInput: '',
      price: '',
      websiteAge: '',
      images: [],
      bannerImageUrl: '',
      bannerImageID: '',
      technologyStack: '',
   };

   const [formData, setFormData] = useState<ProductData>(initialProductData);
   const [originalData, setOriginalData] = useState<ProductData>(initialProductData);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [currentImage, setCurrentImage] = useState({ imageUrl: '', imageId: '' });
   const [errors, setErrors] = useState({
      slug: '',
      title: '',
      price: '',
      bannerImageUrl: '',
      images: '',
      tags: '',
   });

   const router = useRouter();   

   // Load product data when in update mode and productData is available
   useEffect(() => {
      if (action === "update" && productData) {
         const formattedData: ProductData = {
            slug: productData.slug || '',
            title: productData.title || '',
            subTitle: productData.subTitle || '',
            liveLink: productData.liveLink || '',
            productType: productData.productType || '',
            productAbout: productData.productAbout || '',
            tags: Array.isArray(productData.tags) ? productData.tags : [],
            _tagsInput: Array.isArray(productData.tags) ? productData.tags.join(', ') : '',
            price: productData.price !== undefined ? productData.price.toString() : '',
            websiteAge: productData.websiteAge !== undefined ? productData.websiteAge.toString() : '',
            images: Array.isArray(productData.images) ? productData.images : [],
            bannerImageUrl: productData.bannerImageUrl || '',
            bannerImageID: productData.bannerImageID || '',
            technologyStack: Array.isArray(productData.technologyStack)
               ? productData.technologyStack.join(', ')
               : typeof productData.technologyStack === 'string'
                  ? productData.technologyStack
                  : '',
         };

         setFormData(formattedData);
         setOriginalData(formattedData);
      }
   }, [action, productData]);

   const handleInputChange = (
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

   const handleTagsChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => {
      const value = e.target.value;
      setFormData(prev => ({
         ...prev,
         _tagsInput: value,
         tags: value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Filter out empty tags
      }));
      setErrors(prev => ({
         ...prev,
         tags: '',
      }));
   };

   const handleImageInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setCurrentImage(prev => ({
         ...prev,
         [name]: value,
      }));
   };

   const addImage = () => {
      if (currentImage.imageUrl && currentImage.imageId) {
         setFormData(prev => ({
            ...prev,
            images: [...prev.images, { ...currentImage }],
         }));
         setCurrentImage({ imageUrl: '', imageId: '' });
         setErrors(prev => ({
            ...prev,
            images: '',
         }));
      }
   };

   const removeImage = (index: number) => {
      setFormData(prev => ({
         ...prev,
         images: prev.images.filter((_, i) => i !== index),
      }));
   };

   const validateForm = () => {
      const newErrors = {
         slug: '',
         title: '',
         price: '',
         bannerImageUrl: '',
         images: '',
         tags: '',
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

      if (formData.images.length === 0) {
         newErrors.images = 'At least one product image is required';
         isValid = false;
      }

      setErrors(newErrors);
      return isValid;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      if (action === "create") {
         await handleCreateProduct();
      } else if (action === "update") {
         await handleUpdateProduct();
      }
   };

   const handleCreateProduct = async () => {
      setIsSubmitting(true);

      try {
         // Prepare product data without conversion so all fields remain as strings
         const dataToSubmit = { ...formData };
         // Remove temporary field
         delete (dataToSubmit as any)._tagsInput;

         console.log('Submitting product data:', dataToSubmit);

         const res = await createProduct(dataToSubmit);
         if (!res) {
            toast.error('An error occurred while creating the product. Please try again.');
            return;
         }

         // Reset form fields
         setFormData(initialProductData);
         router.push('/admin-dashbord/products');
         toast.success('Product created successfully');
      } catch (error) {
         console.error('Error creating product:', error);
         toast.error('An error occurred while creating the product. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleUpdateProduct = async () => {
      // Create a shallow copy of changed fields
      const changes: Partial<ProductData> = { slug: formData.slug }; // Always include slug for routing

      Object.keys(formData).forEach((key) => {
         const typedKey = key as keyof ProductData;
         // Skip the temporary _tagsInput field
         if (typedKey === '_tagsInput') return;

         // Check if arrays are different
         if (Array.isArray(formData[typedKey]) && Array.isArray(originalData[typedKey])) {
            const formArray = formData[typedKey] as any[];
            const origArray = originalData[typedKey] as any[];

            // Better array comparison - handles objects within arrays
            if (formArray.length !== origArray.length ||
               formArray.some((item, idx) =>
                  JSON.stringify(item) !== JSON.stringify(origArray[idx]))) {
               changes[typedKey] = formData[typedKey] as any;
            }
         }
         // Check if primitive values are different
         else if (formData[typedKey] !== originalData[typedKey]) {
            changes[typedKey] = formData[typedKey] as any;
         }
      });

      // Remove the slug from changes if it wasn't actually changed
      // (we keep it in changes for routing but don't want to update it unnecessarily)
      if (formData.slug === originalData.slug && Object.keys(changes).length > 1) {
         const { slug, ...changesWithoutSlug } = changes;

         if (Object.keys(changesWithoutSlug).length === 0) {
            console.log('No changes made. Nothing to update.');
            toast.info('No changes detected');
            return;
         }
      } else if (Object.keys(changes).length <= 1) { // Only slug is present
         console.log('No changes made. Nothing to update.');
         toast.info('No changes detected');
         return;
      }

      setIsSubmitting(true);
      try {
         const res = await updateProduct(changes);
         if (res.success) {
            toast.success('Product updated successfully');
            // Optionally refresh the data
            if (res.product) {
               setOriginalData({ ...formData });
            }
         } else {
            toast.error(res.error || 'Failed to update product');
         }
      } catch (error) {
         console.error('Error updating product:', error);
         toast.error('An error occurred while updating the product. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   // Field configurations for grid layout
   const inputFields = [
      { id: 'title', label: 'Title', name: 'title', required: true, type: 'text', placeholder: 'Product title', error: errors.title },
      { id: 'slug', label: 'Slug', name: 'slug', required: true, type: 'text', placeholder: 'product-url-slug', error: errors.slug },
      { id: 'subTitle', label: 'Subtitle', name: 'subTitle', required: false, type: 'text', placeholder: 'Sub Heading', error: '' },
      { id: 'liveLink', label: 'Live Link', name: 'liveLink', required: false, type: 'url', placeholder: 'https://example.com', error: '' },
      { id: 'price', label: 'Price', name: 'price', required: true, type: 'number', placeholder: '49.99', error: errors.price },
      { id: 'websiteAge', label: 'Website Age', name: 'websiteAge', required: false, type: 'number', placeholder: '2', error: '' },
      { id: 'technologyStack', label: 'Technology Stack', name: 'technologyStack', required: false, type: 'text', placeholder: 'React, Node.js, MongoDB', error: '' },
   ];

   return (
      <div className="space-y-6 animate-fadeIn">
         <h2 className="text-2xl font-bold">
            {action === 'create' ? 'Create New Product' : 'Edit Product'}
         </h2>

         {/* Status indicator for update mode */}
         {action === "update" && (
            <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
               <p className="text-blue-700 flex items-center">
                  <span className="mr-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                     </svg>
                  </span>
                  You are editing product: <strong className="ml-1">{formData.title}</strong>
               </p>
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
                     { value: 'E-commerce', label: 'E-commerce' },
                     { value: 'Portfolio', label: 'Portfolio' },
                     { value: 'Business', label: 'Business' },
                     { value: 'Personal-Blog', label: 'Personal-Blog' },
                     { value: 'Landing-Page', label: 'Landing-Page' },
                     { value: 'SaaS', label: 'SaaS' },
                     { value: 'Educational', label: 'Educational' },
                     { value: 'Real-Estate', label: 'Real-Estate' },
                     { value: 'Job-Portal', label: 'Job-Portal' },
                     { value: 'Social-Network', label: 'Social-Network' },
                  ]}
               />
            </div>

            {/* Tags */}
            <div className="form-group mt-6">
               <FormField
                  htmlFor="_tagsInput"
                  labelText="Tags"
                  name="_tagsInput"
                  value={formData._tagsInput}
                  onChange={handleTagsChange}
                  placeholder="Separate tags with commas: e-commerce, responsive, portfolio"
                  error={errors.tags}
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
            <div className="mt-6">
               <FormField
                  fieldType="textarea"
                  htmlFor="productAbout"
                  labelText="Product Description"
                  name="productAbout"
                  value={formData.productAbout}
                  onChange={handleInputChange}
                  inputClass="form-input min-h-[150px]"
                  placeholder="Detailed description of the product..."
               />
            </div>

            {/* Banner Image */}
            <div className="form-group mt-6">
               <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                     htmlFor="bannerImageUrl"
                     labelText="Banner Image URL"
                     name="bannerImageUrl"
                     isRequired={true}
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
                     value={formData.bannerImageID}
                     onChange={handleInputChange}
                     placeholder="Banner Image ID"
                  />
               </div>
               {formData.bannerImageUrl && (
                  <div className="mt-4">
                     <p className="text-secondary text-sm mb-2">Banner Preview:</p>
                     <div className="bg-background-secondary border border-theme p-2 rounded">
                        <div className="relative h-32 w-full">
                           <Image
                              src={formData.bannerImageUrl}
                              fill
                              sizes="100%"
                              alt="Banner preview"
                              className="object-cover rounded"
                              onError={(e) => {
                                 // Hide image on error and show fallback
                                 (e.target as HTMLImageElement).style.display = 'none';
                                 (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                           />
                           <div className="hidden absolute inset-0 items-center justify-center bg-gray-100 rounded">
                              <p className="text-gray-500">Image could not be loaded</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Product Images */}
               <div className="form-group mt-6">
                  <h3 className="text-lg font-medium mb-3">Product Images</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                     <FormField
                        htmlFor="imageUrl"
                        labelText="Image URL"
                        name="imageUrl"
                        value={currentImage.imageUrl}
                        onChange={handleImageInputChange}
                        placeholder="Image URL"
                     />
                     <FormField
                        htmlFor="imageId"
                        labelText="Image ID"
                        name="imageId"
                        value={currentImage.imageId}
                        onChange={handleImageInputChange}
                        placeholder="Image ID"
                     />
                  </div>
                  <button
                     type="button"
                     onClick={addImage}
                     disabled={!currentImage.imageUrl || !currentImage.imageId}
                     className="btn btn-secondary mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                     Add Image
                  </button>
                  {errors.images && (
                     <p className="text-accent-red text-sm mt-1">{errors.images}</p>
                  )}

                  {formData.images.length > 0 && (
                     <div className="mt-4">
                        <p className="text-secondary text-sm mb-2">Added Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                           {formData.images.map((img, index) => (
                              <div
                                 key={index}
                                 className="relative bg-background-secondary p-2 rounded border border-theme"
                              >
                                 <div className="relative aspect-square">
                                    <Image
                                       src={img.imageUrl}
                                       fill
                                       sizes="100%"
                                       alt={`Product image ${index + 1}`}
                                       className="object-cover rounded"
                                       onError={(e) => {
                                          // Hide image on error and show fallback
                                          (e.target as HTMLImageElement).style.display = 'none';
                                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                       }}
                                    />
                                    <div className="hidden absolute inset-0 items-center justify-center bg-gray-100 rounded">
                                       <p className="text-gray-500 text-xs">Image not available</p>
                                    </div>
                                 </div>
                                 <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 m-1 p-1 h-6 w-6 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
                                    aria-label="Remove image"
                                 >
                                    ×
                                 </button>
                                 <p className="text-xs text-secondary mt-1 truncate">{img.imageId}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               {/* Submit Button */}
               <div className="flex justify-end mt-6">
                  <button
                     type="button"
                     onClick={() => router.push('/admin-dashbord/products')}
                     className="mr-4 px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
                  >
                     {isSubmitting ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Processing...
                        </>
                     ) : (
                        action === 'create' ? 'Create Product' : 'Update Product'
                     )}
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
}

export default ProductForm;