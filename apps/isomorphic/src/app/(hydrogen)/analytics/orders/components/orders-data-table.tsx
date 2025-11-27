'use client';

import { useState } from 'react';
import WidgetCard from '@core/components/cards/widget-card';
import { Select } from 'rizzui';
import type { OrdersTableResponse } from '@/types/analytics.types';
import OrdersTableHeader from './orders-table-header';
import OrdersTableBody from './orders-table-body';
import OrdersPagination from './orders-pagination';

interface OrdersDataTableProps {
  data?: OrdersTableResponse;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onStatusFilter: (status?: string) => void;
  selectedStatus?: string;
  isLoading?: boolean;
  limit: number;
}

const LIMIT_OPTIONS = [
  { label: '10 rows', value: '10' },
  { label: '20 rows', value: '20' },
  { label: '50 rows', value: '50' },
];

export default function OrdersDataTable({
  data,
  onPageChange,
  onLimitChange,
  onStatusFilter,
  selectedStatus,
  isLoading,
  limit,
}: OrdersDataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const orders = data?.data || [];
  const total = data?.pagination?.totalRecords || 0;
  const currentPage = data?.pagination?.currentPage || 1;
  const totalPages = data?.pagination?.totalPages || 1;

  const STATUS_OPTIONS = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Failed', value: 'failed' },
  ];

  return (
    <WidgetCard
      title="Orders Data"
      className="mt-6"
      headerClassName="items-center"
      action={
        <div className="flex gap-3">
          <Select
            value={selectedStatus === '' ? 'All status' : selectedStatus}
            options={STATUS_OPTIONS}
            onChange={(value: { value?: string }) =>
              onStatusFilter(value.value)
            }
            className="w-40"
            placeholder="Filter by status"
          />
          <Select
            value={limit.toString()}
            options={LIMIT_OPTIONS}
            onChange={(value: { value: string }) =>
              onLimitChange(Number(value.value))
            }
            className="w-32"
          />
        </div>
      }
    >
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <OrdersTableHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <OrdersTableBody orders={orders} isLoading={isLoading} />
        </table>
      </div>

      <OrdersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        total={total}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </WidgetCard>
  );
}
