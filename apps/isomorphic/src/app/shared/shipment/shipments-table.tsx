'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Text, ActionIcon, Tooltip } from 'rizzui';
import { PiEyeDuotone, PiPencilDuotone, PiTrashDuotone } from 'react-icons/pi';
import { useShipments, useDeleteShipment } from '@/hooks/use-shipment';
import { routes } from '@/config/routes';
import { Shipment, ShipmentStatus } from '@/types';
import { STATUS_BADGE_CONFIG } from '@/types/shipment.types';
import DeletePopover from '@core/components/delete-popover';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';

const statusColors = STATUS_BADGE_CONFIG;

export default function ShipmentsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | ''>('');

  const { data, isLoading, error } = useShipments({
    page,
    limit,
    status: statusFilter || undefined,
  });

  const { mutate: deleteShipment, isPending: isDeleting } = useDeleteShipment();

  // Filter data by search term (client-side for tracking number and courier)
  const filteredData = useMemo(() => {
    if (!data?.shipments) return [];

    if (!searchTerm) return data.shipments;

    const search = searchTerm.toLowerCase();
    return data.shipments.filter(
      (shipment) =>
        shipment.trackingNumber.toLowerCase().includes(search) ||
        shipment.courier.toLowerCase().includes(search)
    );
  }, [data?.shipments, searchTerm]);

  const columns = useMemo(
    () => [
      {
        header: 'Tracking Number',
        accessorKey: 'trackingNumber',
        cell: ({ row }: any) => (
          <Text className="font-medium text-gray-900">
            {row.original.trackingNumber}
          </Text>
        ),
      },
      {
        header: 'Order ID',
        accessorKey: 'orderId',
        cell: ({ row }: any) => {
          const order = row.original.orderId;
          const orderId =
            typeof order === 'string'
              ? order
              : order?.orderNumber || order?._id;
          return (
            <Text className="text-gray-700">{orderId?.substring(0, 8)}...</Text>
          );
        },
      },
      {
        header: 'Courier',
        accessorKey: 'courier',
        cell: ({ row }: any) => (
          <Text className="text-gray-700">{row.original.courier}</Text>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }: any) => {
          const status = row.original.status as ShipmentStatus;
          const config = statusColors[status];
          return (
            <Badge variant={config.variant as any} color={config.color as any}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        header: 'Estimated Delivery',
        accessorKey: 'estimatedDelivery',
        cell: ({ row }: any) => {
          const date = row.original.estimatedDelivery;
          if (!date) return <Text className="text-gray-400">N/A</Text>;
          return (
            <Text className="text-gray-700">
              {new Date(date).toLocaleDateString()}
            </Text>
          );
        },
      },
      {
        header: 'Cost',
        accessorKey: 'cost',
        cell: ({ row }: any) => (
          <Text className="font-medium text-gray-900">
            ${row.original.cost.toFixed(2)}
          </Text>
        ),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2">
            <Tooltip content="View Details" placement="top">
              <ActionIcon
                variant="text"
                size="sm"
                onClick={() =>
                  router.push(routes.eCommerce.shipment.shipmentDetails(row.original._id))
                }
              >
                <PiEyeDuotone className="h-4 w-4" />
              </ActionIcon>
            </Tooltip>

            <Tooltip content="Edit Shipment" placement="top">
              <ActionIcon
                variant="text"
                size="sm"
                onClick={() =>
                  router.push(routes.eCommerce.shipment.editShipment(row.original._id))
                }
              >
                <PiPencilDuotone className="h-4 w-4" />
              </ActionIcon>
            </Tooltip>

            <DeletePopover
              title="Delete Shipment"
              description={`Are you sure you want to delete tracking #${row.original.trackingNumber}?`}
              onDelete={() => deleteShipment(row.original._id)}
            />
          </div>
        ),
      },
    ],
    [router, deleteShipment, isDeleting]
  );

  const { table, setData } = useTanStackTable({
    tableData: filteredData,
    columnConfig: columns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: limit,
        },
      },
      meta: {
        handleDeleteRow: (row: Shipment) => {
          deleteShipment(row._id);
        },
      },
      enableSorting: true,
    },
  });

  if (error) {
    return (
      <div className="p-6 text-center">
        <Text className="text-red-500">Failed to load shipments</Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by tracking number or courier..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="">All Statuses</option>
          <option value="In-Warehouse">In Warehouse</option>
          <option value="Shipped">Shipped</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Returned">Returned</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Results Count */}
      {data && (
        <Text className="text-sm text-gray-600">
          Showing {filteredData.length} of {data.total} shipments
        </Text>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-12 text-center">
            <Text>Loading shipments...</Text>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <Text className="text-gray-500">No shipments found</Text>
            <button
              onClick={() => router.push(routes.eCommerce.shipment.createShipment)}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            >
              Create First Shipment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-gray-200 bg-gray-50"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                      >
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === 'function'
                            ? header.column.columnDef.header(
                                header.getContext()
                              )
                            : header.column.columnDef.header}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="flex items-center justify-between">
          <Text className="text-sm text-gray-600">
            Page {page} of {Math.ceil(data.total / limit)}
          </Text>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(data.total / limit)}
              className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
