import Link from 'next/link';
import React, { useState } from 'react';

const CategoryDataRow = ({ category }: {
  category: {
    _id: string;
    title: string;
    subTitle: string;
    slug: string;
    isFeatured: boolean;
    createdAt: string;
    productsCount: number;
  }
}) => {

  const [isFeatured, setIsFeatured] = useState(category.isFeatured);

  const handleIsFeaturedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFeatured(event.target.checked);
  };

  return (
    <tr key={category._id} className="border-t border-theme hover:bg-background-secondary transition-all">
      <td className="px-4 py-3">
        <div className="font-medium text-primary">{category.title}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-secondary text-sm">{category.subTitle}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={handleIsFeaturedChange}
              className="sr-only"
            />
            <div className={`w-10 h-5 rounded-full transition-all ${isFeatured ? 'bg-accent-green' : 'bg-background-secondary'} relative border border-theme`}>
              <span className={`absolute inset-y-0 left-0 bg-foreground w-4 h-4 rounded-full transition-all transform ${isFeatured ? 'translate-x-5' : 'translate-x-1'} my-0.5`}></span>
            </div>
          </label>
        </div>
      </td>
      <td className="px-4 py-3 text-center font-medium">
        {category.productsCount}
      </td>
      <td className='className="px-4 py-3 text-center font-medium"'>
        <Link
          href={`/admin-dashbord/update-category/${category.slug}`}
          className="btn btn-secondary text-sm py-1 px-3"
        >
          Edit
        </Link>
        <button className="btn btn-secondary text-sm py-1 px-3 text-accent-red">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default CategoryDataRow;