'use client';

import { Title, Text, Badge, Button } from 'rizzui';
import cn from '@core/utils/class-names';
import type { Order } from '@/types/order.types';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { formatToNaira } from '@/libs/currencyFormatter';

interface DeliveryDetailsProps {
  order: Order;
  className?: string;
}

const getOrderStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: any; label: string }> = {
    Pending: { color: 'warning', label: 'Pending' },
    Processing: { color: 'info', label: 'Processing' },
    Shipped: { color: 'secondary', label: 'Shipped' },
    Delivered: { color: 'success', label: 'Delivered' },
    Cancelled: { color: 'danger', label: 'Cancelled' },
  };
  const statusInfo = statusMap[status] || { color: 'default', label: status };
  return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
};

export default function DeliveryDetails({
  order,
  className,
}: DeliveryDetailsProps) {
  const shipment = order.shipment;
  const shippingAddress = order.shippingAddress || shipment?.shippingAddress;

  return (
    <div className={cn('space-y-6', className)}>
      {order.deliveryType === 'pickup' ? (
        <div className="rounded-xl border border-gray-300 p-6">
          <Title as="h3" className="mb-4 text-lg font-semibold">
            Delivery Details
          </Title>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-4">
            <Text className="font-semibold text-gray-900">
              Delivery Method:
            </Text>
            <Text className="capitalize text-gray-700">Pickup</Text>
          </div>
        </div>
      ) : (
        <>
          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-300 p-6">
            <Title as="h3" className="mb-4 text-lg font-semibold">
              Delivery Details
            </Title>

            {shippingAddress && (
              <div>
                <Text className="mb-2 font-semibold text-gray-900">
                  Shipping Address
                </Text>
                <div className="space-y-1 rounded-lg bg-gray-50 p-4">
                  <Text className="font-medium">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </Text>
                  <Text className="text-gray-600">
                    {shippingAddress.phoneNumber}
                  </Text>
                  <Text className="text-gray-600">
                    {shippingAddress.address1}
                  </Text>
                  {shippingAddress.address2 && (
                    <Text className="text-gray-600">
                      {shippingAddress.address2}
                    </Text>
                  )}
                  <Text className="text-gray-600">
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.zipCode}
                  </Text>
                  {shippingAddress.lga && (
                    <Text className="text-gray-600">
                      LGA: {shippingAddress.lga}
                    </Text>
                  )}
                  <Text className="text-gray-600">
                    {shippingAddress.country}
                  </Text>
                </div>
              </div>
            )}

            {!shippingAddress && (
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <Text className="text-gray-600">
                  Shipping address not available
                </Text>
              </div>
            )}
          </div>

          {/* Shipment Information */}
          {shipment && (
            <div className="rounded-xl border border-gray-300 p-6">
              <Title as="h3" className="mb-4 text-lg font-semibold">
                Shipment Information
              </Title>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm text-gray-600">
                    Tracking Number:
                  </Text>
                  <Text className="font-medium">{shipment.trackingNumber}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-600">Status:</Text>
                  {getOrderStatusBadge(shipment.status)}
                </div>
                {shipment.courier && (
                  <div>
                    <Text className="text-sm text-gray-600">Courier:</Text>
                    <Text className="font-medium capitalize">
                      {shipment.courier}
                    </Text>
                  </div>
                )}
                <div>
                  <Text className="text-sm text-gray-600">Shipping Cost:</Text>
                  <Text className="font-medium">
                    {formatToNaira(shipment.cost)}
                  </Text>
                </div>
                {shipment.estimatedDelivery && (
                  <div>
                    <Text className="text-sm text-gray-600">
                      Estimated Delivery:
                    </Text>
                    <Text className="font-medium">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </Text>
                  </div>
                )}
                {shipment.deliveredOn && (
                  <div>
                    <Text className="text-sm text-gray-600">Delivered On:</Text>
                    <Text className="font-medium">
                      {new Date(shipment.deliveredOn).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </Text>
                  </div>
                )}
              </div>

              <Link
                href={routes.eCommerce.shipment.shipmentDetails(shipment._id)}
              >
                <Button
                  variant="flat"
                  className="mt-4 w-full !cursor-pointer rounded-lg hover:bg-black hover:text-white"
                >
                  View shipment
                </Button>
              </Link>
            </div>
          )}

          {/* No shipment created yet */}
          {!shipment && (
            <div className="rounded-xl border border-gray-300 p-6">
              <Title as="h3" className="mb-4 text-lg font-semibold">
                Shipment Information
              </Title>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <Text className="text-gray-600">
                  Shipment details not available yet
                </Text>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
