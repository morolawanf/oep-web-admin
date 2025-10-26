'use client';

import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button, Input, Select, Textarea, Alert } from 'rizzui';
import axios from 'axios';
import { Form } from '@core/ui/form';
import { refundProcessSchema, RefundProcessInput } from '@/validators/return-schema';
import VerticalFormBlockWrapper from '@/app/shared/VerticalFormBlockWrapper';
import { BackendValidationError, extractBackendErrors } from '@/libs/form-errors';
import { useProcessRefund } from '@/hooks/mutations/useProcessRefund';
import { handleApiError } from '@/libs/axios';
import toast from 'react-hot-toast';

// Format currency helper
const formatCurrency = (value: number, currency = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface RefundProcessFormProps {
  returnId: string;
  totalRefundAmount: number | null;
  currentStatus: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const REFUND_METHOD_OPTIONS = [
  { value: 'original_payment', label: 'Original Payment Method (Paystack)' },
  { value: 'store_credit', label: 'Store Credit' },
  { value: 'bank_transfer', label: 'Manual Bank Transfer' },
];

export default function RefundProcessForm({
  returnId,
  totalRefundAmount,
  currentStatus,
  onSuccess,
  onCancel,
}: RefundProcessFormProps) {
  const [componentError, setComponentError] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<BackendValidationError[] | null>(null);

  const processRefundMutation = useProcessRefund(returnId, {
    onSuccess: () => {
      setComponentError(null);
      setApiErrors(null);
      onSuccess?.();
    },
    onError: (error: Error) => {
      const errorMessage = handleApiError(error);
      setComponentError(errorMessage);

      // Extract backend validation errors if available
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const backendErrors = extractBackendErrors(error.response.data);
        if (backendErrors) {
          setApiErrors(backendErrors);
        }
      }
    },
  });

  // Check if return is in refundable state
  const isRefundable = currentStatus === 'approved';
  const canProcessRefund = isRefundable && totalRefundAmount && totalRefundAmount > 0;

  const handleSubmit = (data: RefundProcessInput) => {
    setComponentError(null);
    setApiErrors(null);
    processRefundMutation.mutate(data);
  };

  return (
    <Form<RefundProcessInput>
      validationSchema={refundProcessSchema}
      onSubmit={handleSubmit}
      useFormProps={{
        mode: 'onSubmit',
        defaultValues: {
          refundAmount: totalRefundAmount || 0,
          refundMethod: 'original_payment',
          adminNotes: '',
        },
      }}
      className="flex flex-col gap-6"
    >
      {({ register, control, formState: { errors, isSubmitting }, setError }) => {
        // Set backend errors when apiErrors changes
        useEffect(() => {
          if (apiErrors && apiErrors.length > 0) {
            apiErrors.forEach((error) => {
              if (error.path && error.msg) {
                setError(error.path as any, {
                  type: 'manual',
                  message: error.msg,
                });
              }
            });
          }
        }, [apiErrors, setError]);

        return (
          <>
            {/* Display component-level error */}
            {componentError && (
              <Alert color="danger" className="mb-4">
                <strong>Error:</strong> {componentError}
              </Alert>
            )}

            {/* Status Warning */}
            {!isRefundable && (
              <Alert color="warning" className="mb-4">
                <strong>Note:</strong> Refunds can only be processed when the return status is
                "approved" (after inspection passes). Current status: <strong>{currentStatus}</strong>
              </Alert>
            )}

            {/* Refund Amount Display */}
            <VerticalFormBlockWrapper
              title="Calculated Refund Amount"
              description="Total amount eligible for refund based on returned items"
            >
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(totalRefundAmount || 0, 'NGN')}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {totalRefundAmount ? 'Calculated from returned item prices' : 'No refund amount calculated yet'}
                </p>
              </div>
            </VerticalFormBlockWrapper>

            {/* Refund Amount Input */}
            <VerticalFormBlockWrapper
              title="Refund Amount"
              description="Enter the amount to refund (in Kobo - Nigerian currency subunit)"
            >
              <Input
                type="number"
                {...register('refundAmount', { valueAsNumber: true })}
                placeholder="15000"
                suffix="Kobo"
                error={errors.refundAmount?.message as string}
                disabled={!canProcessRefund || isSubmitting}
              />
              <p className="mt-2 text-sm text-gray-500">
                1 Naira = 100 Kobo. Example: ₦150.00 = 15000 Kobo
              </p>
            </VerticalFormBlockWrapper>

            {/* Refund Method */}
            <VerticalFormBlockWrapper
              title="Refund Method"
              description="Select how the refund should be processed"
            >
              <Controller
                name="refundMethod"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={REFUND_METHOD_OPTIONS}
                    value={value}
                    onChange={onChange}
                    placeholder="Select refund method"
                    error={errors.refundMethod?.message as string}
                    getOptionValue={(option) => option.value}
                    displayValue={(selected: string) =>
                      REFUND_METHOD_OPTIONS.find((opt) => opt.value === selected)?.label ?? selected
                    }
                    disabled={!canProcessRefund || isSubmitting}
                  />
                )}
              />
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p><strong>Original Payment Method:</strong> Refund via Paystack to customer's payment source</p>
                <p><strong>Store Credit:</strong> Add refund amount to customer's store credit balance</p>
                <p><strong>Bank Transfer:</strong> Manual bank transfer processed by finance team</p>
              </div>
            </VerticalFormBlockWrapper>

            {/* Admin Notes */}
            <VerticalFormBlockWrapper
              title="Admin Notes"
              description="Add notes about this refund (optional)"
            >
              <Textarea
                {...register('adminNotes')}
                placeholder="e.g., Full refund processed after confirming defect"
                rows={4}
                error={errors.adminNotes?.message as string}
                disabled={!canProcessRefund || isSubmitting}
              />
            </VerticalFormBlockWrapper>

            {/* Warning Message */}
            {canProcessRefund && (
              <Alert color="info" className="mt-4">
                <strong>Important:</strong> Processing this refund will:
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Create a refund transaction</li>
                  <li>Update the return status to "completed"</li>
                  <li>
                    {totalRefundAmount && totalRefundAmount > 0
                      ? `Refund ${formatCurrency(totalRefundAmount, 'NGN')} to the customer`
                      : 'Process the specified refund amount'}
                  </li>
                </ul>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting || processRefundMutation.isPending}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                isLoading={isSubmitting || processRefundMutation.isPending}
                disabled={!canProcessRefund}
                color="danger"
              >
                Process Refund
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
