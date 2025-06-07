'use client';

import { useState } from 'react';
import { Button, Badge, Text, Title, ActionIcon } from 'rizzui';
import { routes } from '@/config/routes';
import Link from 'next/link';
import Image from 'next/image';
import {
  PiPencilBold,
  PiShoppingBagBold,
  PiTagBold,
  PiCalendarBold,
  PiTrashBold,
} from 'react-icons/pi';
import {
  CampaignDataType,
  CampaignChildProduct,
  CampaignChildSale,
} from '@/data/campaigns-data';
import DateCell from '@core/ui/date-cell';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { createColumnHelper } from '@tanstack/react-table';

// Column definitions for products table
const productColumnHelper = createColumnHelper<CampaignChildProduct>();
const productColumns = [
  productColumnHelper.display({
    id: 'product',
    header: 'Product',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded">
          <Image
            src={row.original.image}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
        <Text className="font-medium">{row.original.name}</Text>
      </div>
    ),
  }),
  productColumnHelper.accessor('price', {
    header: 'Price',
    cell: ({ getValue }) => <Text className="font-medium">${getValue()}</Text>,
  }),
  productColumnHelper.display({
    id: 'discount',
    header: 'Discount',
    cell: ({ row }) => {
      const discount = (row.original as any).discount;
      return discount ? (
        <Badge variant="flat" color="success">
          {discount}% off
        </Badge>
      ) : (
        <Text className="text-gray-400">No discount</Text>
      );
    },
  }),
];

// Column definitions for sales table
const saleColumnHelper = createColumnHelper<CampaignChildSale>();
const saleColumns = [
  saleColumnHelper.display({
    id: 'sale',
    header: 'Sale',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded">
          <Image
            src={row.original.product.image}
            alt={row.original.title}
            fill
            className="object-cover"
          />
        </div>
        <Text className="font-medium">{row.original.title}</Text>
      </div>
    ),
  }),
  saleColumnHelper.accessor('discount', {
    header: 'Discount',
    cell: ({ getValue }) => <Text className="font-medium">{getValue()}%</Text>,
  }),
  saleColumnHelper.accessor('type', {
    header: 'Type',
    cell: ({ getValue }) => (
      <Badge
        variant="flat"
        color={
          getValue() === 'Flash'
            ? 'danger'
            : getValue() === 'Limited'
              ? 'warning'
              : 'secondary'
        }
      >
        {getValue()}
      </Badge>
    ),
  }),
  saleColumnHelper.display({
    id: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <div className="text-sm">
        <div>
          <DateCell date={new Date(row.original.startDate)} />
        </div>
        <div className="text-xs text-gray-500">to</div>
        <div>
          <DateCell date={new Date(row.original.endDate)} />
        </div>
      </div>
    ),
  }),
];

interface OneCampaignProps {
  campaign: CampaignDataType;
  id: string;
}

export default function OneCampaign({ campaign, id }: OneCampaignProps) {
  // Table configurations
  const productsTable = useTanStackTable<CampaignChildProduct>({
    tableData: campaign.children.products,
    columnConfig: productColumns,
    options: {
      enableSorting: false,
      enableColumnResizing: false,
    },
  });

  const salesTable = useTanStackTable<CampaignChildSale>({
    tableData: campaign.children.sales,
    columnConfig: saleColumns,
    options: {
      enableSorting: false,
      enableColumnResizing: false,
    },
  });
  const isDeleted = campaign.deleted;

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-3">
        {/* Campaign Overview */}
        <div className="col-span-3 @3xl:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-start gap-6">
              {/* Bigger Campaign Image */}
              <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <Title as="h1" className="text-2xl font-bold">
                    {campaign.title}
                  </Title>
                  <Badge
                    variant={campaign.isActive ? 'solid' : 'outline'}
                    color={campaign.isActive ? 'success' : 'secondary'}
                    className="font-medium"
                  >
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Text className="mb-4 text-gray-600 dark:text-gray-400">
                  {campaign.description}
                </Text>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div>
                    <Text className="font-medium">Created:</Text>
                    <DateCell date={new Date(campaign.createdAt)} />
                  </div>
                  <div>
                    <Text className="font-medium">Updated:</Text>
                    <DateCell date={new Date(campaign.updatedAt)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Stats */}
            <div className="grid gap-4 @xl:grid-cols-2">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800/50">
                    <PiShoppingBagBold className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Text className="text-2xl font-bold text-blue-600">
                      {campaign.children.products.length}
                    </Text>
                    <Text className="text-sm text-gray-600">Products</Text>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-800/50">
                    <PiTagBold className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <Text className="text-2xl font-bold text-green-600">
                      {campaign.children.sales.length}
                    </Text>
                    <Text className="text-sm text-gray-600">Sales</Text>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-800/50">
                    <Text className="text-lg font-bold text-orange-600">%</Text>
                  </div>
                  <div>
                    <Text className="text-2xl font-bold text-orange-600">
                      {campaign.children.sales.length > 0
                        ? Math.max(
                            ...campaign.children.sales.map((s) => s.discount)
                          )
                        : 0}
                      %
                    </Text>
                    <Text className="text-sm text-gray-600">Max Discount</Text>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-800/50">
                    <Text className="text-lg font-bold text-purple-600">$</Text>
                  </div>
                  <div>
                    <Text className="text-2xl font-bold text-purple-600">
                      {campaign.children.products.length > 0
                        ? Math.round(
                            campaign.children.products.reduce(
                              (sum, p) => sum + p.price,
                              0
                            ) / campaign.children.products.length
                          )
                        : 0}
                    </Text>
                    <Text className="text-sm text-gray-600">Avg. Price</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Products Table */}
          {campaign.children.products.length > 0 && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <Title as="h3" className="mb-4 text-lg font-semibold">
                Campaign Products ({campaign.children.products.length})
              </Title>
              <Table
                table={productsTable.table}
                variant="modern"
                classNames={{
                  container: 'border border-muted rounded-md',
                  rowClassName: 'last:border-0',
                }}
              />
            </div>
          )}

          {/* Empty State for Products */}
          {campaign.children.products.length === 0 && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <Title as="h3" className="mb-4 text-lg font-semibold">
                Campaign Products (0)
              </Title>
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <PiShoppingBagBold className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <Text className="text-gray-500">
                    No products added to this campaign
                  </Text>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Sales Table */}
          {campaign.children.sales.length > 0 && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <Title as="h3" className="mb-4 text-lg font-semibold">
                Campaign Sales ({campaign.children.sales.length})
              </Title>
              <Table
                table={salesTable.table}
                variant="modern"
                classNames={{
                  container: 'border border-muted rounded-md',
                  rowClassName: 'last:border-0',
                }}
              />
            </div>
          )}

          {/* Empty State for Sales */}
          {campaign.children.sales.length === 0 && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <Title as="h3" className="mb-4 text-lg font-semibold">
                Campaign Sales (0)
              </Title>
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <PiTagBold className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <Text className="text-gray-500">
                    No sales added to this campaign
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Campaign Details Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Title as="h3" className="mb-4 text-lg font-semibold">
              Campaign Details
            </Title>
            <div className="space-y-4">
              <div>
                <Text className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </Text>
                <Badge
                  variant={campaign.isActive ? 'solid' : 'outline'}
                  color={campaign.isActive ? 'success' : 'secondary'}
                  className="font-medium"
                >
                  {campaign.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <Text className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Created
                </Text>
                <Text className="text-gray-900 dark:text-gray-100">
                  <DateCell date={new Date(campaign.createdAt)} />
                </Text>
              </div>
              <div>
                <Text className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Updated
                </Text>
                <Text className="text-gray-900 dark:text-gray-100">
                  <DateCell date={new Date(campaign.updatedAt)} />
                </Text>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Title as="h3" className="mb-4 text-lg font-semibold">
              Quick Actions
            </Title>
            <div className="space-y-3">
              <Link href={routes.eCommerce.editCampaign(id)} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <PiPencilBold className="mr-2 h-4 w-4" />
                  Edit Campaign
                </Button>
              </Link>
              <Link href={routes.eCommerce.campaign} className="block">
                <Button variant="outline" className="w-full justify-start">
                  Back to Campaigns
                </Button>
              </Link>{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
