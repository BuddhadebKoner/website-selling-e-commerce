import { createProduct } from '@/endpoints/admin.api'
import React, { useState } from 'react'

export interface ProductData {
   slug: string
   title: string
   subTitle: string
   liveLink: string
   productType: string
   productAbout: string
   tags: string[]
   _tagsInput: string
   price: string
   websiteAge: string
   images: { imageUrl: string; imageId: string }[]
   bannerImageUrl: string
   bannerImageID: string
   technologyStack: string
}

const ProductForm = ({ action, formData, setFormData }: {
   action: string
   formData: ProductData
   setFormData: React.Dispatch<React.SetStateAction<ProductData>>
}) => {
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [submitSuccess, setSubmitSuccess] = useState(false)
   const [currentImage, setCurrentImage] = useState({ imageUrl: '', imageId: '' })


   const [errors, setErrors] = useState({
      slug: '',
      title: '',
      price: '',
      bannerImageUrl: '',
      images: '',
      tags: ''
   })

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
         ...prev,
         [name]: value
      }))

      // Clear error when field is being edited
      if (name in errors) {
         setErrors(prev => ({
            ...prev,
            [name]: ''
         }))
      }
   }

   const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData(prev => ({
         ...prev,
         _tagsInput: value,
         tags: value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      }))

      // Clear tags error
      setErrors(prev => ({
         ...prev,
         tags: ''
      }))
   }

   const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setCurrentImage(prev => ({
         ...prev,
         [name]: value
      }))
   }

   const addImage = () => {
      if (currentImage.imageUrl && currentImage.imageId) {
         setFormData(prev => ({
            ...prev,
            images: [...prev.images, { ...currentImage }]
         }))
         setCurrentImage({ imageUrl: '', imageId: '' })

         // Clear images error
         setErrors(prev => ({
            ...prev,
            images: ''
         }))
      }
   }

   const removeImage = (index: number) => {
      setFormData(prev => ({
         ...prev,
         images: prev.images.filter((_, i) => i !== index)
      }))
   }

   const validateForm = () => {
      const newErrors = {
         slug: '',
         title: '',
         price: '',
         bannerImageUrl: '',
         images: '',
         tags: ''
      }
      let isValid = true

      // Required fields validation
      if (!formData.title.trim()) {
         newErrors.title = 'Title is required'
         isValid = false
      }

      if (!formData.slug.trim()) {
         newErrors.slug = 'Slug is required'
         isValid = false
      } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
         newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
         isValid = false
      }

      if (!formData.price) {
         newErrors.price = 'Price is required'
         isValid = false
      } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
         newErrors.price = 'Price must be a valid positive number'
         isValid = false
      }

      if (!formData.bannerImageUrl) {
         newErrors.bannerImageUrl = 'Banner image URL is required'
         isValid = false
      }

      if (formData.images.length === 0) {
         newErrors.images = 'At least one product image is required'
         isValid = false
      }

      setErrors(newErrors)
      return isValid
   }

   const handleCreateProduct = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
         return
      }

      setIsSubmitting(true)

      try {
         // Format data to match expected API structure
         const dataToSubmit = {
            ...formData,
            price: Number(formData.price),
            websiteAge: formData.websiteAge ? Number(formData.websiteAge) : undefined,
            technologyStack: formData.technologyStack ? formData.technologyStack.split(',').map(tech => tech.trim()) : []
         }

         // Remove temporary fields
         delete (dataToSubmit as any)._tagsInput

         console.log('Submitting product data:', dataToSubmit)

         if (action === 'add') {
            await createProduct(dataToSubmit)
            setSubmitSuccess(true)

            // Reset form after successful submission
            setFormData({
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
               technologyStack: ''
            })

            // Hide success message after 5 seconds
            setTimeout(() => {
               setSubmitSuccess(false)
            }, 5000)
         }
      } catch (error) {
         console.error('Error creating product:', error)
         alert('An error occurred while creating the product. Please try again.')
      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <div className="space-y-6 animate-fadeIn">
         {submitSuccess && (
            <div className="bg-accent-green-light text-primary p-4 rounded mb-6 animate-slideDown">
               Product information logged successfully!
            </div>
         )}

         <form onSubmit={handleCreateProduct} className="bg-box p-6 rounded-lg border border-theme">
            <div className="grid md:grid-cols-2 gap-6">
               {/* Title and Slug */}
               <div className="form-group">
                  <label htmlFor="title" className="form-label">
                     Title <span className="text-accent-red">*</span>
                  </label>
                  <input
                     type="text"
                     id="title"
                     name="title"
                     value={formData.title}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="Product title"
                  />
                  {errors.title && <p className="text-accent-red text-sm mt-1">{errors.title}</p>}
               </div>

               <div className="form-group">
                  <label htmlFor="slug" className="form-label">
                     Slug <span className="text-accent-red">*</span>
                  </label>
                  <input
                     type="text"
                     id="slug"
                     name="slug"
                     value={formData.slug}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="product-url-slug"
                  />
                  {errors.slug && <p className="text-accent-red text-sm mt-1">{errors.slug}</p>}
               </div>

               {/* Subtitle and Live Link */}
               <div className="form-group">
                  <label htmlFor="subTitle" className="form-label">Subtitle</label>
                  <input
                     type="text"
                     id="subTitle"
                     name="subTitle"
                     value={formData.subTitle}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="Brief description"
                  />
               </div>

               <div className="form-group">
                  <label htmlFor="liveLink" className="form-label">Live Link</label>
                  <input
                     type="url"
                     id="liveLink"
                     name="liveLink"
                     value={formData.liveLink}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="https://example.com"
                  />
               </div>

               {/* Product Type and Price */}
               <div className="form-group">
                  <label htmlFor="productType" className="form-label">Product Type</label>
                  <select
                     id="productType"
                     name="productType"
                     value={formData.productType}
                     onChange={handleInputChange}
                     className="form-input"
                  >
                     <option value="">Select product type</option>
                     <option value="website">Website</option>
                     <option value="template">Template</option>
                     <option value="plugin">Plugin</option>
                     <option value="service">Service</option>
                  </select>
               </div>

               <div className="form-group">
                  <label htmlFor="price" className="form-label">
                     Price <span className="text-accent-red">*</span>
                  </label>
                  <input
                     type="number"
                     id="price"
                     name="price"
                     value={formData.price}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="49.99"
                  />
                  {errors.price && <p className="text-accent-red text-sm mt-1">{errors.price}</p>}
               </div>

               {/* Website Age and Technology Stack */}
               <div className="form-group">
                  <label htmlFor="websiteAge" className="form-label">Website Age</label>
                  <input
                     type="text"
                     id="websiteAge"
                     name="websiteAge"
                     value={formData.websiteAge}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="2 years"
                  />
               </div>

               <div className="form-group">
                  <label htmlFor="technologyStack" className="form-label">Technology Stack</label>
                  <input
                     type="text"
                     id="technologyStack"
                     name="technologyStack"
                     value={formData.technologyStack}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="React, Node.js, MongoDB"
                  />
               </div>
            </div>

            {/* Tags */}
            <div className="form-group mt-6">
               <label htmlFor="tags" className="form-label">Tags</label>
               <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData._tagsInput || ''}
                  onChange={handleTagsChange}
                  className="form-input"
                  placeholder="Separate tags with commas: e-commerce, responsive, portfolio"
               />
               {errors.tags && <p className="text-accent-red text-sm mt-1">{errors.tags}</p>}

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

            {/* About */}
            <div className="form-group mt-6">
               <label htmlFor="productAbout" className="form-label">Product Description</label>
               <textarea
                  id="productAbout"
                  name="productAbout"
                  value={formData.productAbout}
                  onChange={handleInputChange}
                  className="form-input min-h-[150px]"
                  placeholder="Detailed description of the product..."
               />
            </div>

            {/* Banner Image */}
            <div className="form-group mt-6">
               <label className="form-label">
                  Banner Image <span className="text-accent-red">*</span>
               </label>
               <div className="grid md:grid-cols-2 gap-4">
                  <input
                     type="text"
                     name="bannerImageUrl"
                     value={formData.bannerImageUrl}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="Banner Image URL"
                  />
                  <input
                     type="text"
                     name="bannerImageID"
                     value={formData.bannerImageID}
                     onChange={handleInputChange}
                     className="form-input"
                     placeholder="Banner Image ID"
                  />
               </div>
               {errors.bannerImageUrl && <p className="text-accent-red text-sm mt-1">{errors.bannerImageUrl}</p>}

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

            {/* Product Images */}
            <div className="form-group mt-6">
               <label className="form-label">
                  Product Images <span className="text-accent-red">*</span>
               </label>
               <div className="grid md:grid-cols-2 gap-4">
                  <input
                     type="text"
                     name="imageUrl"
                     value={currentImage.imageUrl}
                     onChange={handleImageInputChange}
                     className="form-input"
                     placeholder="Image URL"
                  />
                  <input
                     type="text"
                     name="imageId"
                     value={currentImage.imageId}
                     onChange={handleImageInputChange}
                     className="form-input"
                     placeholder="Image ID"
                  />
               </div>
               <button
                  type="button"
                  onClick={addImage}
                  disabled={!currentImage.imageUrl || !currentImage.imageId}
                  className="btn btn-secondary mt-2"
               >
                  Add Image
               </button>
               {errors.images && <p className="text-accent-red text-sm mt-1">{errors.images}</p>}

               {/* Image Preview */}
               {formData.images.length > 0 && (
                  <div className="mt-4">
                     <p className="text-secondary text-sm mb-2">Added Images:</p>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {formData.images.map((img, index) => (
                           <div key={index} className="relative bg-background-secondary p-2 rounded border border-theme">
                              <img
                                 src={img.imageUrl}
                                 alt={`Product image ${index + 1}`}
                                 className="w-full aspect-square object-cover rounded"
                                 onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                              <button
                                 type="button"
                                 onClick={() => removeImage(index)}
                                 className="btn btn-primary bg-accent-red absolute top-0 right-0 m-1 p-1 h-8 w-8 rounded-full flex items-center justify-center"
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
            <div className="mt-8 flex justify-end">
               <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary px-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
               >
                  {isSubmitting ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                     </>
                  ) : action === 'add' ? (
                     'Create Product'
                  ) : (
                     'Update Product'
                  )}
               </button>
            </div>
         </form>
      </div>
   )
}

export default ProductForm