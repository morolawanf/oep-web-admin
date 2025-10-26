'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input, Textarea } from 'rizzui';
import { useAddTrackingUpdate } from '@/hooks/use-shipment';
import {
  addTrackingSchema,
  type AddTrackingFormData,
} from '@/validators/shipment-schema';
import { SHIPMENT_STATUSES } from '@/types/shipment.types';

interface AddTrackingModalProps {
  shipmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTrackingModal({
  shipmentId,
  isOpen,
  onClose,
}: AddTrackingModalProps) {
  const { mutate: addTracking, isPending } = useAddTrackingUpdate(shipmentId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTrackingFormData>({
    resolver: zodResolver(addTrackingSchema),
    defaultValues: {
      location: '',
      description: '',
      timestamp: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: AddTrackingFormData) => {
    addTracking(data, {
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
        <h2 className="mb-4 text-xl font-semibold">Add Tracking Update</h2>
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

          <Input
            label="Location *"
            placeholder="e.g., New York Distribution Center"
            {...register('location')}
            error={errors.location?.message}
          />

          <Textarea
            label="Description *"
            placeholder="Package arrived at facility..."
            {...register('description')}
            error={errors.description?.message}
            rows={3}
          />

          <Input
            label="Timestamp"
            type="datetime-local"
            {...register('timestamp')}
            error={errors.timestamp?.message}
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
              Add Tracking Update
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
