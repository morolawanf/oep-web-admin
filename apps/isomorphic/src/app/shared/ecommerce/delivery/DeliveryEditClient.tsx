'use client';

import { useRouter } from 'next/navigation';
import { Alert, Button, Input, Select, Textarea } from 'rizzui';
import { handleApiError } from '@/libs/axios';
import { SHIPMENT_STATUSES } from '@/types/shipment.types';
import { useDeliveryAddTracking, useDeliveryUpdateNotes, useDeliveryUpdateStatus } from '@/hooks/mutations/useDelivery';
import { useDeliveryById } from '@/hooks/queries/useDeliveries';
import { routes } from '@/config/routes';

export default function DeliveryEditClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: delivery, isLoading, error, isError } = useDeliveryById(id);

  const updateStatus = useDeliveryUpdateStatus(id);
  const addTracking = useDeliveryAddTracking(id);
  const updateNotes = useDeliveryUpdateNotes(id);

  if (isLoading) return <div className="p-6">Loading delivery...</div>;
  if (isError)
    return (
      <Alert color="danger" className="mb-4">
        <strong>Error:</strong> {handleApiError(error)}
      </Alert>
    );
  if (!delivery) return <div className="p-6">Delivery not found</div>;

  const isDelivered = delivery.status === 'Delivered';

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Update Status</h3>
        <div className="flex gap-3">
          <Select
            disabled={isDelivered || updateStatus.isPending}
            value={delivery.status}
            onChange={(value: any) =>
              updateStatus.mutate({ status: value as any }, {
                onSuccess: () => {},
              })
            }
            options={SHIPMENT_STATUSES.map((s) => ({ label: s, value: s }))}
          />
          <Button
            disabled={isDelivered || updateStatus.isPending}
            isLoading={updateStatus.isPending}
            onClick={() => updateStatus.mutate({ status: delivery.status })}
          >
            Save Status
          </Button>
        </div>
      </div>

      {/* Add Tracking */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Add Tracking Update</h3>
        <div className="grid gap-3 @md:grid-cols-3">
          <Select
            placeholder="Status"
            disabled={isDelivered || addTracking.isPending}
            options={SHIPMENT_STATUSES.map((s) => ({ label: s, value: s }))}
            onChange={(value: any) => (window as any).__deliveryTrackingStatus = value}
          />
          <Input
            placeholder="Location"
            disabled={isDelivered || addTracking.isPending}
            onChange={(e) => (window as any).__deliveryTrackingLocation = e.target.value}
          />
          <Input
            placeholder="Description"
            disabled={isDelivered || addTracking.isPending}
            onChange={(e) => (window as any).__deliveryTrackingDescription = e.target.value}
          />
          <div className="@md:col-span-3">
            <Button
              disabled={isDelivered || addTracking.isPending}
              isLoading={addTracking.isPending}
              onClick={() => {
                const status = (window as any).__deliveryTrackingStatus;
                const location = (window as any).__deliveryTrackingLocation;
                const description = (window as any).__deliveryTrackingDescription;
                if (!status || !location || !description) return;
                addTracking.mutate({ status, location, description });
              }}
            >
              Add Tracking
            </Button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Notes</h3>
        <Textarea
          defaultValue={delivery.notes || ''}
          disabled={isDelivered || updateNotes.isPending}
          onChange={(e) => ((window as any).__deliveryNotes = e.target.value)}
        />
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(routes.eCommerce.delivery.details(id))}
          >
            Cancel
          </Button>
          <Button
            disabled={isDelivered || updateNotes.isPending}
            isLoading={updateNotes.isPending}
            onClick={() => updateNotes.mutate({ notes: (window as any).__deliveryNotes || '' })}
          >
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  );
}
