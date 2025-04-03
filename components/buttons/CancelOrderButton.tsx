import React from 'react'

const CancelOrderButton = () => {
   
   const handleCancel = () => {
      // Handle order cancel logic
      console.log("Order cancelled.");
   };

   return (
      <>
         <button onClick={handleCancel} className="btn btn-secondary text-xs py-1.5 px-3">Cancel Order</button>
      </>
   )
}

export default CancelOrderButton