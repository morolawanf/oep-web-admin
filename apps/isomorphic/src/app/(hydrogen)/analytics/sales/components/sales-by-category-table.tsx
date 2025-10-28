'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { SalesByCategoryResponse } from '@/types/analytics.types';
import { Text } from 'rizzui';

interface SalesByCategoryTableProps {
  data?: SalesByCategoryResponse;
  isLoading?: boolean;
}

export default function SalesByCategoryTable({ data, isLoading }: SalesByCategoryTableProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Sales by Category" className="@container">
        <div className="mt-5 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </WidgetCard>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <WidgetCard title="Sales by Category" className="@container">
        <div className="mt-5 flex items-center justify-center py-10">
          <Text className="text-gray-500">No category data available</Text>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Sales by Category"
      description={`Top performing categories (${data.data.length} of ${data.pagination.totalRecords})`}
      className="@container"
    >
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left font-semibold text-gray-700">Category</th>
              <th className="pb-3 text-right font-semibold text-gray-700">Revenue</th>
              <th className="pb-3 text-right font-semibold text-gray-700">Orders</th>
              <th className="pb-3 text-right font-semibold text-gray-700">Avg Value</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0">
                <td className="py-3 text-gray-900 font-medium">{row.category}</td>
                <td className="py-3 text-right text-gray-700">₦{row.totalRevenue.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-700">{row.totalOrders.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-700">₦{row.averageOrderValue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.pagination && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Text className="text-xs text-gray-500 text-center">
            Page {data.pagination.currentPage} of {data.pagination.totalPages} • {data.pagination.totalRecords} total categories
          </Text>
        </div>
      )}
    </WidgetCard>
  );
}
