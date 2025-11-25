'use client';

import { Order, OrdersListResponse, OrdersQueryParams } from '@/types/order.types';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import { ordersColumns } from './columns';
import { useCallback, useEffect } from 'react';
import { PaginationState, Updater } from '@tanstack/react-table';
import TableSkeleton from '../categories/category-list/table-skeleton';

interface OrdersTableProps {
  orders?: OrdersListResponse;
  queryParams: OrdersQueryParams;
  onViewOrder: (order: Order) => void;
  isLoading?: boolean;
    onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function OrdersTable({
  orders = {
    orders: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  },
  onViewOrder,
  isLoading = false,
  queryParams,
    onPageChange,
  onPageSizeChange,
}: OrdersTableProps) {



  const { table, setData } = useTanStackTable<Order>({
    tableData: orders.orders,
    columnConfig: ordersColumns(onViewOrder),
    options: {
      initialState: {
        pagination: {
          pageIndex: (queryParams.page ?? orders.pagination.page) - 1,
          pageSize: queryParams.limit ||  orders.pagination.limit,
        },
      },
      pageCount: orders.pagination.pages,
      manualPagination: true, 
      enableColumnResizing: false,
    },
  });

  useEffect(() => {
    setData(orders.orders);
  }, [orders]);


  // Handle pagination changes via table state
  useEffect(() => {
    const state = table.getState();
    const newPage = state.pagination.pageIndex + 1;
    if (queryParams && newPage !== queryParams.page) {
      onPageChange?.(newPage);
    }
  }, [table.getState().pagination.pageIndex, queryParams, onPageChange]);


  return (
    <div>
      <Table
      isLoading={isLoading}
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TablePagination table={table} className="py-4" />
    </div>
  );
}
