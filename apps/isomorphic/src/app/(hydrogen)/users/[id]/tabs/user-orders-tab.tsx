'use client';

import { Title, Text, Badge } from 'rizzui';
import DateCell from '@core/ui/date-cell';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { Order } from '@/types/user';

interface UserOrdersTabProps {
  orders: Order[];
  totalOrders: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const getStatusBadgeColor = (status: string) => {
  const colors: Record<string, any> = {
    Pending: 'warning',
    Processing: 'info',
    Shipped: 'secondary',
    Delivered: 'success',
    Cancelled: 'danger',
    Returned: 'danger',
  };
  return colors[status] || 'secondary';
};

export default function UserOrdersTab({
  orders,
  totalOrders,
  currentPage,
  onPageChange,
}: UserOrdersTabProps) {
  return (
    <div className="rounded-lg border border-muted bg-white p-6">
      <Title as="h3" className="mb-4 text-lg font-semibold">
        Orders ({totalOrders})
      </Title>
      {orders.length === 0 ? (
        <Text className="py-8 text-center text-gray-500">No orders found</Text>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={routes.eCommerce.orderDetails(order._id)}
              className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="font-medium">
                    Order #{order.orderNumber || order._id.slice(-8)}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-600">
                    <DateCell date={new Date(order.createdAt)} />
                  </Text>
                </div>
                <div className="text-right">
                  <Badge color={getStatusBadgeColor(order.status)} className="capitalize">
                    {order.status}
                  </Badge>
                  <Text className="mt-1 font-semibold">${order.total.toFixed(2)}</Text>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
