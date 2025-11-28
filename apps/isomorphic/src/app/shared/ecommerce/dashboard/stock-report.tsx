'use client';

import { productsData } from '@/data/products-data';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Table from '@core/components/table';
import WidgetCard from '@core/components/cards/widget-card';
import cn from '@core/utils/class-names';
import TablePagination from '@core/components/table/pagination';
import { Input, Text, Badge, Avatar } from 'rizzui';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { createColumnHelper } from '@tanstack/react-table';

export type ProductsDataType = (typeof productsData)[number];

const columnHelper = createColumnHelper<ProductsDataType>();

const stockReportColumns = [
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Product',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.original.image} name={row.original.name} />
        <Text className="font-medium">{row.original.name}</Text>
      </div>
    ),
  }),
  columnHelper.accessor('category', {
    id: 'category',
    header: 'Category',
    cell: ({ getValue }) => <Text>{getValue()}</Text>,
  }),
  columnHelper.accessor('sku', {
    id: 'sku',
    header: 'SKU',
    cell: ({ getValue }) => <Text className="font-mono text-sm">{getValue()}</Text>,
  }),
  columnHelper.accessor('stock', {
    id: 'stock',
    header: 'Stock',
    cell: ({ getValue }) => {
      const stock = getValue();
      return (
        <Badge
          variant="flat"
          color={stock === 0 ? 'danger' : stock < 20 ? 'warning' : 'success'}
        >
          {stock} units
        </Badge>
      );
    },
  }),
  columnHelper.accessor('price', {
    id: 'price',
    header: 'Price',
    cell: ({ getValue }) => <Text className="font-medium">₦{getValue()}</Text>,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <Badge
          variant="flat"
          color={status === 'Publish' ? 'success' : status === 'Pending' ? 'warning' : 'secondary'}
        >
          {status}
        </Badge>
      );
    },
  }),
];

export default function StockReport({ className }: { className?: string }) {
  const { table, setData } = useTanStackTable<ProductsDataType>({
    tableData: productsData,
    columnConfig: stockReportColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
      },
      enableColumnResizing: false,
    },
  });
  return (
    <WidgetCard
      title="Stock Report"
      className={cn('p-0 lg:p-0', className)}
      headerClassName="mb-6 px-5 pt-5 lg:px-7 lg:pt-7"
      action={
        <Input
          type="search"
          clearable={true}
          inputClassName="h-[36px]"
          placeholder="Search by patient name..."
          onClear={() => table.setGlobalFilter('')}
          value={table.getState().globalFilter ?? ''}
          prefix={<PiMagnifyingGlassBold className="size-4" />}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="w-full @3xl:order-3 @3xl:ms-auto @3xl:max-w-72"
        />
      }
    >
      <Table
        table={table}
        variant="modern"
        classNames={{
          rowClassName: 'last:border-0',
        }}
      />
      <TablePagination table={table} className="p-4" />
    </WidgetCard>
  );
}
