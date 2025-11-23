'use client';

import { Alert, Badge, Text } from 'rizzui';
import { useDeliveryById } from '@/hooks/queries/useDeliveries';
import { handleApiError } from '@/libs/axios';
import { getCdnUrl } from '@core/utils/cdn-url';
import Image from 'next/image';

export default function DeliveryDetailsClient({ id }: { id: string }) {
  const { data: delivery, isLoading, error, isError } = useDeliveryById(id);

  if (isLoading) return <div className="p-6">Loading delivery...</div>;
  if (isError)
    return (
      <Alert color="danger" className="mb-4">
        <strong>Error:</strong> {handleApiError(error)}
      </Alert>
    );
  if (!delivery) return <div className="p-6">Delivery not found</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Text className="text-3xl font-bold">{delivery.trackingNumber}</Text>
            <div className="mt-2">
              <Badge>{delivery.status}</Badge>
            </div>
          </div>
        </div>

        <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
        <div className="space-y-1">
          <Text className="font-medium">
            {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
          </Text>
          <Text>{delivery.shippingAddress.phoneNumber}</Text>
          <Text>{delivery.shippingAddress.address1}</Text>
          {delivery.shippingAddress.address2 && <Text>{delivery.shippingAddress.address2}</Text>}
          <Text>
            {delivery.shippingAddress.city}, {delivery.shippingAddress.state} {delivery.shippingAddress.zipCode}
          </Text>
          <Text>{delivery.shippingAddress.country}</Text>
        </div>
      </div>

      {/* Products Ordered */}
      {typeof delivery.orderId !== 'string' && delivery.orderId?.products && delivery.orderId.products.length > 0 && (
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold">Products Ordered</h3>
          <div className="space-y-4">
            {delivery.orderId.products.map((item: any, index: number) => {
              const coverImage = item.product?.description_images?.find((img: any) => img.cover_image)?.url;
              const imageUrl = coverImage || item.product?.description_images?.[0]?.url || '';
              
              return (
              <div key={item._id || index} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                {imageUrl && (
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={getCdnUrl(imageUrl)}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {item.product?.name || 'Unknown Product'}
                  </Text>
                  {item.product?.slug && (
                    <Text className="text-sm text-gray-500">{item.product.slug}</Text>
                  )}
                  {item.attributes && item.attributes.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {item.attributes.map((attr: any, attrIndex: number) => (
                        <Badge key={attrIndex} variant="flat" size="sm">
                          {attr.key}: {attr.value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <Text className="text-sm text-gray-500 font-semibold">Qty: 
                    <span className='font-bold text-base text-stone-950'>
                    {item.qty}
                    </span>
                    </Text>
                  
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-2 text-lg font-semibold">Notes</h3>
        <Text className="text-gray-700">{delivery.notes || 'No notes'}</Text>
      </div>

      {/* Tracking History */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Tracking History</h3>
        {delivery.trackingHistory && delivery.trackingHistory.length > 0 ? (
          <div className="space-y-4">
            {delivery.trackingHistory.map((entry: any, index: number) => (
              <div key={index} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between">
                  <Text className="font-semibold text-gray-900">{entry.location}</Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </Text>
                </div>
                <Text className="text-gray-700">{entry.description}</Text>
              </div>
            ))}
          </div>
        ) : (
          <Text className="text-gray-500">No tracking history available</Text>
        )}
      </div>
    </div>
  );
}
