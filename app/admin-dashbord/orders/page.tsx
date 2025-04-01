'use client'

export default function OrdersPage() {
  return (
    <div className="space-y-6 animate-fadeIn">

      <div className="bg-box rounded-lg overflow-hidden border border-theme">
        <table className="w-full">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#ORD-1082", customer: "John Smith", date: "Mar 12, 2025", amount: "$125.00", status: "Delivered", statusColor: "accent-green" },
              { id: "#ORD-1081", customer: "Lisa Johnson", date: "Mar 11, 2025", amount: "$245.99", status: "Processing", statusColor: "accent-yellow" },
              { id: "#ORD-1080", customer: "Ryan Cooper", date: "Mar 10, 2025", amount: "$89.50", status: "Shipped", statusColor: "highlight-primary" },
              { id: "#ORD-1079", customer: "Emma Wilson", date: "Mar 10, 2025", amount: "$312.75", status: "Delivered", statusColor: "accent-green" },
              { id: "#ORD-1078", customer: "Michael Davis", date: "Mar 09, 2025", amount: "$78.25", status: "Cancelled", statusColor: "accent-red" },
              { id: "#ORD-1077", customer: "Sarah Lee", date: "Mar 08, 2025", amount: "$149.99", status: "Delivered", statusColor: "accent-green" },
              { id: "#ORD-1076", customer: "David Brown", date: "Mar 07, 2025", amount: "$199.50", status: "Processing", statusColor: "accent-yellow" },
              { id: "#ORD-1075", customer: "Jennifer Miller", date: "Mar 06, 2025", amount: "$67.25", status: "Shipped", statusColor: "highlight-primary" },
            ].map((order, i) => (
              <tr key={i} className="border-t border-theme">
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3 text-secondary">{order.date}</td>
                <td className="px-4 py-3 font-medium">{order.amount}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-sm bg-opacity-10 ${`bg-${order.statusColor} text-${order.statusColor}`
                    }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}