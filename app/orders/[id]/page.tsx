// "use client";

// import React from 'react';
// import { useGetOrderByTrackId } from '@/lib/react-query/queriesAndMutation'; 
// import Link from 'next/link';

// const OrderDetailPage = ({ params }) => {
//    const trackId = params.trackId;

//    const {
//       data: order,
//       isLoading,
//       isError,
//       error,
//    } = useGetOrderByTrackId(trackId);

//    if (isLoading) {
//       return (
//          <div className="flex items-center justify-center h-screen bg-background text-primary">
//             <div className="animate-fadeIn text-lg">Loading order details...</div>
//          </div>
//       );
//    }

//    if (isError) {
//       return (
//          <div className="flex items-center justify-center h-screen bg-background text-red">
//             <div className="text-lg">Error: {error.message}</div>
//          </div>
//       );
//    }

//    if (!order) {
//       return (
//          <div className="flex flex-col items-center justify-center h-screen bg-background text-primary">
//             <div className="text-lg mb-4">Order not found</div>
//             <Link href="/orders" className="btn btn-primary">
//                Back to Orders
//             </Link>
//          </div>
//       );
//    }

//    // Status color mapping
//    const getStatusColor = (status) => {
//       const statusMap = {
//          pending: 'text-yellow',
//          processing: 'text-accent-orange',
//          shipped: 'text-accent-green-light',
//          delivered: 'text-accent-green',
//          cancelled: 'text-accent-red'
//       };
//       return statusMap[status] || 'text-secondary';
//    };

//    return (
//       <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
//          <div className="mb-6">
//             <Link href="/orders" className="text-highlight hover:underline flex items-center">
//                <span>← Back to Orders</span>
//             </Link>
//          </div>

//          <div className="card border-theme p-6 mb-8">
//             <div className="flex flex-col md:flex-row justify-between mb-6 border-b border-theme pb-4">
//                <div>
//                   <h1 className="text-2xl font-bold mb-2">Order Details</h1>
//                   <p className="text-secondary">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
//                </div>
//                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
//                   <div className="mb-2">
//                      <span className="text-sm text-secondary">Tracking ID:</span>
//                      <span className="ml-2 font-medium">{order.trackId}</span>
//                   </div>
//                   <div className="mb-2">
//                      <span className="text-sm text-secondary">Invoice ID:</span>
//                      <span className="ml-2 font-medium">{order.invoiceId}</span>
//                   </div>
//                </div>
//             </div>

//             <div className="flex flex-col md:flex-row justify-between mb-6">
//                <div className="mb-4 md:mb-0">
//                   <h2 className="font-semibold mb-2">Order Status</h2>
//                   <span className={`status-badge ${getStatusColor(order.status)} px-3 py-1 rounded-full text-sm font-medium`}>
//                      {order.status}
//                   </span>
//                </div>
//                <div>
//                   <h2 className="font-semibold mb-2">Payment Status</h2>
//                   <span className={`status-badge ${order.paymentStatus === 'pending' ? 'text-accent-orange' : 'text-accent-green'} px-3 py-1 rounded-full text-sm font-medium`}>
//                      {order.paymentStatus}
//                   </span>
//                </div>
//             </div>

//             <div className="mb-8">
//                <h2 className="font-semibold mb-4">Products</h2>
//                {order.products.map((product, index) => (
//                   <div key={product._id || index} className="card p-4 mb-4 bg-background-secondary">
//                      <div className="flex justify-between mb-2">
//                         <h3 className="font-medium">{product.title}</h3>
//                         <span className="font-bold">₹{product.price.toFixed(2)}</span>
//                      </div>
//                      <div className="flex flex-wrap gap-4 text-sm text-secondary">
//                         <span>Type: {product.productType}</span>
//                         <span>Offer: {product.OfferStatus}</span>
//                         {product.OfferType && (
//                            <span>Discount: {product.discount}{product.OfferType === 'percentage' ? '%' : ' ₹'}</span>
//                         )}
//                      </div>
//                   </div>
//                ))}
//             </div>

//             <div className="border-t border-theme pt-4">
//                <h2 className="font-semibold mb-4">Order Summary</h2>
//                <div className="grid grid-cols-2 gap-2 text-sm">
//                   <span className="text-secondary">Subtotal:</span>
//                   <span className="text-right">₹{order.subtotal.toFixed(2)}</span>

//                   <span className="text-secondary">Discount:</span>
//                   <span className="text-right text-accent-green">-₹{order.discountAmount.toFixed(2)}</span>

//                   <span className="text-secondary">Tax:</span>
//                   <span className="text-right">₹{order.taxAmount.toFixed(2)}</span>

//                   <span className="font-bold mt-2">Total:</span>
//                   <span className="text-right font-bold mt-2">₹{order.payableAmount.toFixed(2)}</span>
//                </div>
//             </div>

//             {order.paymentStatus === 'pending' && (
//                <div className="mt-8 flex gap-4">
//                   <button className="btn btn-primary w-full">Pay Now</button>
//                   <button className="btn btn-secondary w-full">Cancel Order</button>
//                </div>
//             )}
//          </div>
//       </div>
//    );
// };

// export default OrderDetailPage;


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page