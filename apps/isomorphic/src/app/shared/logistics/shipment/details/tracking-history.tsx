'use client';

import { Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { formatDate } from '@core/utils/format-date';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';
import type { Order } from '@/types/order.types';

export const getColumns = () => [
  {
    title: <span className="ml-6 block">Date</span>,
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 200,
    render: (timestamp: Date) => (
      <div className="ml-6">
        <Text className="mb-1 font-medium text-gray-700">
          {formatDate(timestamp, 'MMMM D, YYYY')}
        </Text>
        <Text className="text-[13px] text-gray-500">
          {formatDate(timestamp, 'h:mm A')}
        </Text>
      </div>
    ),
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    width: 200,
    render: (location?: string) => (
      <Text className="text-gray-700">{location || 'N/A'}</Text>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 300,
    render: (description?: string) => (
      <Text className="text-gray-700">{description || 'N/A'}</Text>
    ),
  },
];

interface TrackingHistoryTableProps {
  order: Order;
  className?: string;
}

export default function TrackingHistoryTable({
  order,
  className,
}: TrackingHistoryTableProps) {
  const trackingHistory = order.shipment?.trackingHistory || [];
  const hasTracking = trackingHistory.length > 0;

  // If pickup order, show message
  if (order.deliveryType === 'pickup') {
    return (
      <div className={cn('rounded-xl border border-gray-300 p-6', className)}>
        <Text className="text-center text-gray-600">
          Tracking history not available for pickup orders
        </Text>
      </div>
    );
  }

  // If no tracking history yet
  if (!hasTracking) {
    return (
      <div className={cn('rounded-xl border border-gray-300 p-6', className)}>
        <Text className="mb-2 text-lg font-semibold">Tracking History</Text>
        <div className="rounded-lg bg-yellow-50 p-4 text-center">
          <Text className="text-gray-600">No tracking history available yet</Text>
        </div>
      </div>
    );
  }

  return (
    <BasicTableWidget
      title="Tracking History"
      className={cn('pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0', className)}
      data={trackingHistory}
      getColumns={getColumns}
      noGutter
      enableSearch={false}
      scroll={{
        x: 900,
      }}
    />
  );
}
