'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Button, Select, Text } from 'rizzui';
import { formatNumber } from '@core/utils/format-number';
import cn from '@core/utils/class-names';
import { PiStar, PiStarFill } from 'react-icons/pi';
import type { ProductPerformanceResponse, ProductPerformanceRow } from '@/types/analytics.types';

interface ProductPerformanceTableProps {
  // backend-shaped response
  data?: ProductPerformanceResponse;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

const LIMIT_OPTIONS = [
  { label: '10 rows', value: '10' },
  { label: '20 rows', value: '20' },
  { label: '50 rows', value: '50' },
];

const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= Math.floor(rating) ? (
        <PiStarFill key={i} className="h-4 w-4 text-yellow-500" />
      ) : (
        <PiStar key={i} className="h-4 w-4 text-gray-300" />
      )
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

export default function ProductPerformanceTable({
  data,
  onPageChange,
  onLimitChange,
  isLoading,
}: ProductPerformanceTableProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Product Performance" className="mt-6">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  const products: ProductPerformanceRow[] = data?.data || [];
  const total = data?.pagination?.totalRecords || 0;
  const currentPage = data?.pagination?.currentPage || 1;
  const limit = data?.pagination && data.pagination.totalPages
    ? Math.ceil(data.pagination.totalRecords / data.pagination.totalPages)
    : 10;
  const totalPages = data?.pagination?.totalPages || Math.ceil(total / limit || 1);

  return (
    <WidgetCard
      title="Product Performance"
      className="mt-6"
      headerClassName="items-center"
      action={
        <Select
          value={limit.toString()}
          options={LIMIT_OPTIONS}
          onChange={(value) => onLimitChange(Number(value))}
          className="w-32"
        />
      }
    >
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">Product</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="font-semibold text-gray-700">Revenue</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-semibold text-gray-700">Qty Sold</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-semibold text-gray-700">Rating</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-semibold text-gray-700">Reviews</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <Text className="text-gray-500">No products found</Text>
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.productId}
                  className={cn(
                    'border-b border-gray-100 transition-colors hover:bg-gray-50',
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  )}
                >
                  <td className="px-4 py-3">
                    <Text className="font-medium text-gray-900">
                      {product.productName}
                    </Text>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Text className="font-semibold text-gray-900">
                      ₦{formatNumber(product.revenue || 0)}
                    </Text>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Text className="font-medium text-gray-700">
                      {formatNumber(product.quantitySold || 0)}
                    </Text>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <RatingStars rating={product.averageRating || 0} />
                      <Text className="text-xs text-gray-500">
                        {(product.averageRating || 0).toFixed(1)}
                      </Text>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Text className="font-medium text-gray-700">
                      {formatNumber(product.reviewCount || 0)}
                    </Text>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <Text className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to{' '}
            {Math.min(currentPage * limit, total)} of {total} products
          </Text>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
