'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea, Select } from 'rizzui';
import { useCreateShipment } from '@/hooks/use-shipment';
import {
  createShipmentSchema,
  type CreateShipmentFormData,
} from '@/validators/shipment-schema';
import { routes } from '@/config/routes';

interface CreateShipmentFormProps {
  orderId?: string;
}

export default function CreateShipmentForm({
  orderId,
}: CreateShipmentFormProps) {
  const router = useRouter();
  const { mutate: createShipment, isPending } = useCreateShipment();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<CreateShipmentFormData>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      orderId: orderId || '',
      courier: '',
      cost: 0,
      shippingAddress: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
  });

  useEffect(() => {
    if (orderId) {
      setValue('orderId', orderId);
    }
  }, [orderId, setValue]);

  const onSubmit = (data: CreateShipmentFormData) => {
    createShipment(data, {
      onSuccess: () => {
  router.push(routes.eCommerce.shipment.shipmentList);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Order ID *"
            placeholder="Enter order ID"
            {...register('orderId')}
            error={errors.orderId?.message}
          />
          <Input
            label="Courier *"
            placeholder="e.g., DHL, FedEx, UPS"
            {...register('courier')}
            error={errors.courier?.message}
          />
          <Input
            label="Shipping Cost *"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('cost', { valueAsNumber: true })}
            error={errors.cost?.message}
          />
          <Input
            label="Estimated Delivery"
            type="date"
            {...register('estimatedDelivery')}
            error={errors.estimatedDelivery?.message}
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="First Name *"
            placeholder="John"
            {...register('shippingAddress.firstName')}
            error={errors.shippingAddress?.firstName?.message}
          />
          <Input
            label="Last Name *"
            placeholder="Doe"
            {...register('shippingAddress.lastName')}
            error={errors.shippingAddress?.lastName?.message}
          />
          <Input
            label="Phone Number *"
            placeholder="+1234567890"
            {...register('shippingAddress.phoneNumber')}
            error={errors.shippingAddress?.phoneNumber?.message}
          />
          <Input
            label="Country *"
            placeholder="United States"
            {...register('shippingAddress.country')}
            error={errors.shippingAddress?.country?.message}
          />
          <div className="md:col-span-2">
            <Input
              label="Address Line 1 *"
              placeholder="123 Main Street"
              {...register('shippingAddress.address1')}
              error={errors.shippingAddress?.address1?.message}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Address Line 2"
              placeholder="Apt 4B"
              {...register('shippingAddress.address2')}
              error={errors.shippingAddress?.address2?.message}
            />
          </div>
          <Input
            label="City *"
            placeholder="New York"
            {...register('shippingAddress.city')}
            error={errors.shippingAddress?.city?.message}
          />
          <Input
            label="State/Province *"
            placeholder="NY"
            {...register('shippingAddress.state')}
            error={errors.shippingAddress?.state?.message}
          />
          <Input
            label="Zip/Postal Code *"
            placeholder="10001"
            {...register('shippingAddress.zipCode')}
            error={errors.shippingAddress?.zipCode?.message}
          />
        </div>
      </div>

      {/* Dimensions (Optional) */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Package Dimensions (Optional)
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label="Length (cm)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('dimensions.length', { valueAsNumber: true })}
            error={errors.dimensions?.length?.message}
          />
          <Input
            label="Width (cm)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('dimensions.width', { valueAsNumber: true })}
            error={errors.dimensions?.width?.message}
          />
          <Input
            label="Height (cm)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('dimensions.height', { valueAsNumber: true })}
            error={errors.dimensions?.height?.message}
          />
          <Input
            label="Weight (kg)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('dimensions.weight', { valueAsNumber: true })}
            error={errors.dimensions?.weight?.message}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Additional Notes</h3>
        <Textarea
          label="Notes"
          placeholder="Add any special instructions or notes..."
          {...register('notes')}
          error={errors.notes?.message}
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(routes.eCommerce.shipment.shipmentList)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          Create Shipment
        </Button>
      </div>
    </form>
  );
}
