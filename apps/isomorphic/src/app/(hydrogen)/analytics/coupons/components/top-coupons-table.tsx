'use client';

import { useState } from 'react';
import WidgetCard from '@core/components/cards/widget-card';
import { Badge, Button, Select, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCaretUpDownBold,
} from 'react-icons/pi';
import type { TopCouponsResponse, TopCouponRow } from '@/types/analytics.types';
import { formatToNaira } from '@/libs/currencyFormatter';

interface TopCouponsTableProps {
  // Accept backend-shaped response: { data: TopCouponRow[], pagination }
  data?: TopCouponsResponse;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

const LIMIT_OPTIONS = [
  { label: '10 rows', value: '10' },
  { label: '20 rows', value: '20' },
  { label: '50 rows', value: '50' },
];

const getStatusBadgeColor = (
  status: string
): 'success' | 'warning' | 'danger' | 'secondary' => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'active':
      return 'success';
    case 'scheduled':
      return 'warning';
    case 'expired':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default function TopCouponsTable({
  data,
  onPageChange,
  onLimitChange,
  isLoading,
}: TopCouponsTableProps) {
  const [sortColumn, setSortColumn] = useState<string>('redemptions');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <PiCaretUpDownBold className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <PiCaretUpBold className="h-4 w-4" />
    ) : (
      <PiCaretDownBold className="h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <WidgetCard title="Top Performing Coupons" className="mt-6">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  // backend shape
  const coupons: TopCouponRow[] = data?.data || [];
  const total = data?.pagination?.totalRecords || 0;
  const currentPage = data?.pagination?.currentPage || 1;
  const limit = data?.pagination.limit ?? 10;
  const totalPages =
    data?.pagination?.totalPages || Math.ceil(total / limit || 10);

  return (
    <WidgetCard
      title="Top Performing Coupons"
      className="mt-6"
      headerClassName="items-center"
      action={
        <Select
          value={limit.toString()}
          options={LIMIT_OPTIONS}
          onChange={(value: { value: string }) =>
            onLimitChange(Number(value.value))
          }
          className="w-32"
        />
      }
    >
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">Rank</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('code')}
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                >
                  Code {getSortIcon('code')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">Type</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="font-semibold text-gray-700">Discount</span>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('redemptions')}
                  className="ml-auto flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                >
                  Redemptions {getSortIcon('redemptions')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('totalDiscountGiven')}
                  className="ml-auto flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                >
                  Total Discount {getSortIcon('totalDiscountGiven')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">Status</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <Text className="text-gray-500">No coupons found</Text>
                </td>
              </tr>
            ) : (
              coupons.map((coupon, index) => {
                const rank = (currentPage - 1) * limit + index + 1;
                return (
                  <tr
                    key={coupon._id}
                    className={cn(
                      'border-b border-gray-100 transition-colors hover:bg-gray-50',
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
                        {rank}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="font-mono font-semibold text-gray-900">
                        {coupon.code}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        color={
                          coupon.type === 'percentage' ? 'info' : 'success'
                        }
                        className="capitalize"
                      >
                        {coupon.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Text className="font-semibold text-gray-900">
                        {coupon.type === 'percentage'
                          ? `${coupon.discount}%`
                          : formatToNaira(coupon.discount)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Text className="font-semibold text-purple-600">
                        {coupon.redemptions}
                      </Text>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Text className="font-semibold text-green-600">
                        {formatToNaira(coupon.totalDiscount)}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        color={getStatusBadgeColor(
                          coupon.type === 'Active' ? 'success' : 'danger'
                        )}
                        className="capitalize"
                      >
                        {coupon.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <Text className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to{' '}
            {Math.min(currentPage * limit, total)} of {total} coupons
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
