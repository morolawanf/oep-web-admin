'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Textarea } from 'rizzui';
import { useUpdateShipmentStatus } from '@/hooks/use-shipment';
import {
  updateStatusSchema,
  type UpdateStatusFormData,
} from '@/validators/shipment-schema';
import { SHIPMENT_STATUSES, type ShipmentStatus } from '@/types/shipment.types';

interface UpdateStatusModalProps {
  shipmentId: string;
  currentStatus: ShipmentStatus;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateStatusModal({
  shipmentId,
  currentStatus,
  isOpen,
  onClose,
}: UpdateStatusModalProps) {
  const { mutate: updateStatus, isPending } =
    useUpdateShipmentStatus(shipmentId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateStatusFormData>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: currentStatus,
      note: '',
    },
  });

  const onSubmit = (data: UpdateStatusFormData) => {
    updateStatus(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Update Shipment Status</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">
              Status *
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:outline-none"
              {...register('status')}
            >
              {SHIPMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          <Textarea
            label="Note (Optional)"
            placeholder="Add a note about this status update..."
            {...register('note')}
            error={errors.note?.message}
            rows={3}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
