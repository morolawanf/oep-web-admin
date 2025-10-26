'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Text, Button, Modal } from 'rizzui';
import {
  PiPackageDuotone,
  PiMapPinDuotone,
  PiCalendarDuotone,
  PiTruckDuotone,
} from 'react-icons/pi';
import { useShipment, useDeleteShipment } from '@/hooks/use-shipment';
import { routes } from '@/config/routes';
import { STATUS_BADGE_CONFIG } from '@/types/shipment.types';
import UpdateStatusModal from './update-status-modal';
import AddTrackingModal from './add-tracking-modal';
import DeletePopover from '@core/components/delete-popover';

interface ShipmentDetailsProps {
  shipmentId: string;
}

export default function ShipmentDetails({ shipmentId }: ShipmentDetailsProps) {
  const router = useRouter();
  const { data: shipment, isLoading } = useShipment(shipmentId);
  const { mutate: deleteShipment, isPending: isDeleting } = useDeleteShipment();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-center">Loading shipment details...</div>;
  }

  if (!shipment) {
    return <div className="p-6 text-center">Shipment not found</div>;
  }

  const statusConfig = STATUS_BADGE_CONFIG[shipment.status];

  const handleDelete = () => {
    deleteShipment(shipmentId, {
      onSuccess: () => {
  router.push(routes.eCommerce.shipment.shipmentList);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-3xl font-bold">{shipment.trackingNumber}</Text>
          <Badge
            variant={statusConfig.variant as any}
            color={statusConfig.color as any}
            className="mt-2"
          >
            {statusConfig.label}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(routes.eCommerce.shipment.editShipment(shipmentId))
            }
          >
            Edit Shipment
          </Button>
          <Button onClick={() => setShowStatusModal(true)}>
            Update Status
          </Button>
          <Button variant="outline" onClick={() => setShowTrackingModal(true)}>
            Add Tracking
          </Button>
          <DeletePopover
            title="Delete Shipment"
            description={`Are you sure you want to delete tracking #${shipment.trackingNumber}?`}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shipment Info */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center gap-2">
            <PiPackageDuotone className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Shipment Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Text className="text-sm text-gray-600">Order ID</Text>
              <Text className="font-medium">
                {typeof shipment.orderId === 'string'
                  ? shipment.orderId
                  : shipment.orderId.orderNumber || shipment.orderId._id}
              </Text>
            </div>
            <div>
              <Text className="text-sm text-gray-600">Courier</Text>
              <Text className="font-medium">{shipment.courier}</Text>
            </div>
            <div>
              <Text className="text-sm text-gray-600">Shipping Cost</Text>
              <Text className="font-medium">${shipment.cost.toFixed(2)}</Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-sm text-gray-600">Created</Text>
                <Text className="font-medium">
                  {new Date(shipment.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <div>
                <Text className="text-sm text-gray-600">Updated</Text>
                <Text className="font-medium">
                  {new Date(shipment.updatedAt).toLocaleDateString()}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center gap-2">
            <PiMapPinDuotone className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Shipping Address</h3>
          </div>
          <div className="space-y-1">
            <Text className="font-medium">
              {shipment.shippingAddress.firstName}{' '}
              {shipment.shippingAddress.lastName}
            </Text>
            <Text>{shipment.shippingAddress.phoneNumber}</Text>
            <Text>{shipment.shippingAddress.address1}</Text>
            {shipment.shippingAddress.address2 && (
              <Text>{shipment.shippingAddress.address2}</Text>
            )}
            <Text>
              {shipment.shippingAddress.city}, {shipment.shippingAddress.state}{' '}
              {shipment.shippingAddress.zipCode}
            </Text>
            <Text>{shipment.shippingAddress.country}</Text>
          </div>
        </div>

        {/* Delivery Dates */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center gap-2">
            <PiCalendarDuotone className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Delivery Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Text className="text-sm text-gray-600">Estimated Delivery</Text>
              <Text className="font-medium">
                {shipment.estimatedDelivery
                  ? new Date(shipment.estimatedDelivery).toLocaleDateString()
                  : 'Not set'}
              </Text>
            </div>
            <div>
              <Text className="text-sm text-gray-600">Actual Delivery</Text>
              <Text className="font-medium">
                {shipment.actualDelivery
                  ? new Date(shipment.actualDelivery).toLocaleDateString()
                  : 'Not delivered yet'}
              </Text>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        {shipment.dimensions && (
          <div className="rounded-lg border border-gray-200 p-6">
            <div className="mb-4 flex items-center gap-2">
              <PiPackageDuotone className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Package Dimensions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {shipment.dimensions.length && (
                <div>
                  <Text className="text-sm text-gray-600">Length</Text>
                  <Text className="font-medium">
                    {shipment.dimensions.length} cm
                  </Text>
                </div>
              )}
              {shipment.dimensions.width && (
                <div>
                  <Text className="text-sm text-gray-600">Width</Text>
                  <Text className="font-medium">
                    {shipment.dimensions.width} cm
                  </Text>
                </div>
              )}
              {shipment.dimensions.height && (
                <div>
                  <Text className="text-sm text-gray-600">Height</Text>
                  <Text className="font-medium">
                    {shipment.dimensions.height} cm
                  </Text>
                </div>
              )}
              {shipment.dimensions.weight && (
                <div>
                  <Text className="text-sm text-gray-600">Weight</Text>
                  <Text className="font-medium">
                    {shipment.dimensions.weight} kg
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tracking History */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="mb-4 flex items-center gap-2">
          <PiTruckDuotone className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Tracking History</h3>
        </div>
        {shipment.trackingHistory.length === 0 ? (
          <Text className="text-gray-500">No tracking history yet</Text>
        ) : (
          <div className="space-y-4">
            {shipment.trackingHistory.map((entry, index) => (
              <div key={entry._id || index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-900"></div>
                  {index < shipment.trackingHistory.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-300"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <Text className="font-medium">
                    {new Date(entry.timestamp).toLocaleString()}
                  </Text>
                  {entry.location && (
                    <Text className="text-sm text-gray-600">
                      {entry.location}
                    </Text>
                  )}
                  {entry.description && (
                    <Text className="mt-1 text-gray-700">
                      {entry.description}
                    </Text>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      {shipment.notes && (
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-2 text-lg font-semibold">Notes</h3>
          <Text className="text-gray-700">{shipment.notes}</Text>
        </div>
      )}

      {/* Modals */}
      <UpdateStatusModal
        shipmentId={shipmentId}
        currentStatus={shipment.status}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      />
      <AddTrackingModal
        shipmentId={shipmentId}
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
      />
    </div>
  );
}
