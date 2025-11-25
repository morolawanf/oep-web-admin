'use client';

import { useOrderById } from '@/hooks/queries/useOrders';
import { Loader, Text } from 'rizzui';
import DeliveryDetails from '@/app/shared/logistics/shipment/details/delivery-details';
import TrackingHistory from '@/app/shared/logistics/shipment/details/tracking-history';

interface DeliveryPageClientProps {
  orderId: string;
}

export default function DeliveryPageClient({ orderId }: DeliveryPageClientProps) {
  const { data: order, isLoading, isError, error } = useOrderById(orderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader variant="spinner" size="xl" />
        <Text className="ml-3 text-gray-600">Loading delivery details...</Text>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex items-center justify-center py-20">
        <Text className="text-red-500">
          Error loading delivery details: {error?.message || 'Order not found'}
        </Text>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-y-6 @container sm:gap-y-10">
      <DeliveryDetails order={order} />
      <TrackingHistory order={order} />
    </div>
  );
}
