'use client';

import Image from 'next/image';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Avatar, Button, Checkbox, Text, Title, Badge } from 'rizzui';
import { CampaignTableMoreAction } from '@core/components/table-utils/campaign-table-more';
import { CampaignsDataType } from './table';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { PiShoppingBagBold, PiTagBold } from 'react-icons/pi';

const columnHelper = createColumnHelper<CampaignsDataType>();

export const campaignsColumns = [
  columnHelper.display({
    id: 'checked',
    size: 50,
    cell: ({ row }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select row"
        checked={row.getIsSelected()}
        onChange={() => row.toggleSelected()}
        disabled={row.original.deleted}
      />
    ),
  }),

  columnHelper.display({
    id: 'campaign',
    size: 300,
    header: 'Campaign',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          <Image
            src={row.original.image}
            alt={row.original.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <Link
            href={routes.eCommerce.CampaignDetails(row.original._id)}
            className="hover:underline"
          >
            <Title
              as="h6"
              className="text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              {row.original.title}
            </Title>
          </Link>
          <Text className="line-clamp-1 text-xs text-gray-500">
            {row.original.description}
          </Text>
        </div>
      </div>
    ),
  }),

  columnHelper.display({
    id: 'status',
    size: 100,
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge
        variant={row.original.isActive ? 'solid' : 'outline'}
        color={row.original.isActive ? 'success' : 'secondary'}
        className="font-medium"
      >
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  }),

  columnHelper.display({
    id: 'children',
    size: 200,
    header: 'Campaign Items',
    enableSorting: false,
    cell: ({ row }) => {
      const productsCount = row.original.children.products.length;
      const salesCount = row.original.children.sales.length;

      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <PiShoppingBagBold className="h-4 w-4 text-blue-600" />
            <Text className="text-sm text-gray-600">
              {productsCount} Products
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <PiTagBold className="h-4 w-4 text-green-600" />
            <Text className="text-sm text-gray-600">{salesCount} Sales</Text>
          </div>
        </div>
      );
    },
  }),

  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    size: 150,
    header: 'Created',
    cell: ({ row }) => <DateCell date={new Date(row.original.createdAt)} />,
  }),

  columnHelper.accessor('updatedAt', {
    id: 'updatedAt',
    size: 150,
    header: 'Updated',
    cell: ({ row }) => <DateCell date={new Date(row.original.updatedAt)} />,
  }),

  columnHelper.display({
    id: 'action',
    size: 50,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <CampaignTableMoreAction
        id={row.original._id}
        disabled={row.original.deleted}
        onDelete={() => meta?.handleDeleteRow?.(row.original)}
      />
    ),
  }),
];
