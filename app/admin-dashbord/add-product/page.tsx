"use client";

import ProductForm from '@/components/ProductForm'
import React, { useState } from 'react'

const page = () => {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subTitle: '',
    liveLink: '',
    productType: '',
    productAbout: '',
    tags: [] as string[],
    _tagsInput: '',
    price: '',
    websiteAge: '',
    images: [] as { imageUrl: string; imageId: string }[],
    bannerImageUrl: '',
    bannerImageID: '',
    technologyStack: ''
  })

  return (
    <ProductForm
      action="add"
      formData={formData}
      setFormData={setFormData}
    />
  )
}

export default page