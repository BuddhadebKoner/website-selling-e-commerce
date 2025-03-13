'use client'

import React from 'react'

export function StatCard({ icon, title, value, change, positive }:{icon: React.ReactNode, title: string, value: string, change: string, positive: boolean}) {
  return (
    <div className="bg-box rounded-lg p-6 border border-theme transition-all hover:shadow-md">
      <div className="flex items-center">
        <div className="mr-4 p-3 bg-accent rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-secondary">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm ${positive ? 'text-accent-green' : 'text-accent-red'}`}>
            {change} from last month
          </p>
        </div>
      </div>
    </div>
  )
}