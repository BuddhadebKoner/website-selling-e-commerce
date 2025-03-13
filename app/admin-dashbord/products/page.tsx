'use client'

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <button className="btn btn-primary">Add New Product</button>
      </div>

      <div className="bg-box rounded-lg overflow-hidden border border-theme">
        <table className="w-full">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Wireless Headphones", category: "Electronics", stock: 24, price: "$149.99" },
              { name: "Smart Watch", category: "Electronics", stock: 18, price: "$199.99" },
              { name: "Bluetooth Speaker", category: "Audio", stock: 32, price: "$89.99" },
              { name: "Laptop Stand", category: "Accessories", stock: 41, price: "$49.99" },
              { name: "Mechanical Keyboard", category: "Peripherals", stock: 15, price: "$129.99" },
              { name: "Wireless Mouse", category: "Peripherals", stock: 27, price: "$69.99" },
              { name: "USB-C Hub", category: "Accessories", stock: 38, price: "$59.99" },
              { name: "External SSD", category: "Storage", stock: 12, price: "$179.99" },
              { name: "Gaming Headset", category: "Gaming", stock: 9, price: "$129.99" },
              { name: "Webcam HD", category: "Peripherals", stock: 21, price: "$79.99" },
            ].map((product, i) => (
              <tr key={i} className="border-t border-theme">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-background-secondary mr-3"></div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-secondary">{product.category}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-sm ${product.stock > 20
                    ? 'bg-accent-green bg-opacity-10 text-accent-green'
                    : product.stock > 10
                      ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow'
                      : 'bg-accent-red bg-opacity-10 text-accent-red'
                    }`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{product.price}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="btn btn-secondary text-sm py-1 px-3">Edit</button>
                    <button className="btn btn-secondary text-sm py-1 px-3 text-accent-red">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}