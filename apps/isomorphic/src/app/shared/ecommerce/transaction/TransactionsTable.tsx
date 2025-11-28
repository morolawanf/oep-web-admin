'use client';

import { Transaction } from '@/types/transaction.types';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import { transactionsColumns } from './columns';
import { useEffect, useRef } from 'react';

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
  isLoading?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
}

export default function TransactionsTable({
  transactions,
  onViewTransaction,
  isLoading = false,
  onPageChange,
}: TransactionsTableProps) {
  const { table, setData } = useTanStackTable<Transaction>({
    tableData: transactions,
    columnConfig: transactionsColumns(onViewTransaction),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      enableColumnResizing: false,
    },
  });

  // Keep table rows in sync with incoming transactions
  useEffect(() => {
    if(transactions){
      setData(transactions);
    }
  }, [transactions, setData]);

  // Notify parent on pagination changes (1-indexed page) with guard to avoid loops
  const lastNotifiedRef = useRef<{ pageIndex: number; pageSize: number } | null>(null);
  useEffect(() => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const last = lastNotifiedRef.current;
    if (!last || last.pageIndex !== pageIndex || last.pageSize !== pageSize) {
      lastNotifiedRef.current = { pageIndex, pageSize };
      onPageChange?.(pageIndex + 1, pageSize);
    }
    // Only re-run when primitive pagination values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, onPageChange]);

  return (
    <div>
      <Table
        table={table}
        variant="modern"
        isLoading={isLoading}
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TablePagination table={table} className="py-4" />
    </div>
  );
}
