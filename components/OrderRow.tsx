'use client'

import React from 'react'

export function OrderRow({ id, customer, date, amount, status, statusColor }:{id: string, customer: string, date: string, amount: string, status: string, statusColor: string}) {
  return (
    <tr className="border-t border-theme">
      <td className="px-4 py-3 font-medium">{id}</td>
      <td className="px-4 py-3">{customer}</td>
      <td className="px-4 py-3 text-secondary">{date}</td>
      <td className="px-4 py-3 font-medium">{amount}</td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-1 rounded text-sm bg-opacity-10 ${`bg-${statusColor} text-${statusColor}`
          }`}>
          {status}
        </span>
      </td>
    </tr>
  )
}