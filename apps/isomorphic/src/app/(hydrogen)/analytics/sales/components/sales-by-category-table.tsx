'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { SalesByCategoryResponse } from '@/types/analytics.types';
import { Text, Button } from 'rizzui';
import { formatToNaira } from '@/libs/currencyFormatter';

interface SalesByCategoryTableProps {
  data?: SalesByCategoryResponse;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export default function SalesByCategoryTable({
  data,
  isLoading,
  onPageChange,
}: SalesByCategoryTableProps) {
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
              <th className="pb-3 text-left font-semibold text-gray-700">
                Category
              </th>
              <th className="pb-3 text-right font-semibold text-gray-700">
                Revenue
              </th>
              <th className="pb-3 text-right font-semibold text-gray-700">
                Total Bought
              </th>
              <th className="pb-3 text-right font-semibold text-gray-700">
                Avg Value
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="ml-auto h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                  </td>
                </tr>
              ))
            ) : (
              data.data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 font-medium text-gray-900">
                    {row.category}
                  </td>
                  <td className="py-3 text-right text-gray-700">
                    ₦{row.totalRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-gray-700">
                    {row.totalOrders.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-gray-700">
                    {formatToNaira(row.averageOrderValue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && data.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <Text className="text-sm text-gray-600">
            Showing {(data.pagination.currentPage - 1) * data.data.length + 1} to{' '}
            {Math.min(
              data.pagination.currentPage * data.data.length,
              data.pagination.totalRecords
            )}{' '}
            of {data.pagination.totalRecords} categories
          </Text>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(data.pagination.currentPage - 1)}
              disabled={data.pagination.currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from(
                { length: Math.min(5, data.pagination.totalPages) },
                (_, i) => {
                  let pageNumber;
                  if (data.pagination.totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (data.pagination.currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (
                    data.pagination.currentPage >=
                    data.pagination.totalPages - 2
                  ) {
                    pageNumber = data.pagination.totalPages - 4 + i;
                  } else {
                    pageNumber = data.pagination.currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        data.pagination.currentPage === pageNumber
                          ? 'solid'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                }
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(data.pagination.currentPage + 1)}
              disabled={
                data.pagination.currentPage === data.pagination.totalPages
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
