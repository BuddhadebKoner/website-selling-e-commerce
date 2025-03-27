import React from 'react'
import OfferForm from '@/components/Forms/OfferForm'

const page = () => {
   return (
      <div className="container mx-auto py-8 px-4">
         <OfferForm action="update" offerData={null} />
      </div>
   )
}

export default page