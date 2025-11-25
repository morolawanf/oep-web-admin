'use client';

import { useState } from 'react';
import { Return, ReturnItem, useReturnById } from '@/hooks/queries/useReturns';
import { Loader, Badge, Text, Button, Alert } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiArrowLeftBold, PiPackageBold, PiUserBold, PiCalendarBold, PiNoteBold } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import ReturnStatusUpdateForm from '@/app/shared/returns/return-status-update-form';
import RefundProcessForm from '@/app/shared/returns/refund-process-form';
import { handleApiError } from '@/libs/axios';

interface ReturnDetailsClientProps {
  returnId: string;
}

// Status badge color mapping
const getStatusColor = (status: string) => {
  const colors: Record<string, 'warning' | 'success' | 'danger' | 'info' | 'secondary'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    items_received: 'info',
    inspecting: 'info',
    inspection_passed: 'success',
    inspection_failed: 'danger',
    completed: 'success',
    cancelled: 'secondary',
  };
  return colors[status] || 'secondary';
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function ReturnDetailsClient({ returnId }: ReturnDetailsClientProps) {
  const router = useRouter();
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);

  const { data: returnData, isLoading, error, refetch } = useReturnById(returnId);

  const handleStatusUpdateSuccess = () => {
    setShowStatusForm(false);
    refetch();
  };

  const handleRefundSuccess = () => {
    setShowRefundForm(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger" className="mb-4">
        <strong>Error loading return details:</strong> {handleApiError(error)}
      </Alert>
    );
  }

  if (!returnData) {
    return (
      <Alert color="danger" className="mb-4">
        <strong>Return not found</strong>
      </Alert>
    );
  }

  const canProcessRefund = returnData.status === 'approved' && !returnData.refundStatus;

  return (
    <div className="@container">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="text"
          onClick={() => router.push(routes.returns.list)}
          className="!p-0 !h-auto hover:underline"
        >
          <PiArrowLeftBold className="mr-1 h-4 w-4" />
          Back to Returns
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="@4xl:col-span-2 space-y-6">
          {/* Return Information Card */}
          <div className="rounded-lg border border-muted bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Return Information</h2>
              <Badge color={getStatusColor(returnData.status)} className="capitalize">
                {returnData.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Text className="mb-1 text-sm font-medium text-gray-500">Return Number</Text>
                <Text className="font-semibold">{returnData.returnNumber}</Text>
              </div>

              <div>
                <Text className="mb-1 text-sm font-medium text-gray-500">Return Type</Text>
                <Badge variant="flat" className="capitalize">
                  {returnData.type}
                </Badge>
              </div>

              <div>
                <Text className="mb-1 text-sm font-medium text-gray-500">Order ID</Text>
                <Text className="font-mono text-sm">{returnData.order._id}</Text>
              </div>

              <div>
                <Text className="mb-1 text-sm font-medium text-gray-500">Order Total</Text>
                <Text className="font-semibold">{formatCurrency(returnData.order.total)}</Text>
              </div>

              <div>
                <Text className="mb-1 text-sm font-medium text-gray-500">Requested At</Text>
                <div className="flex items-center gap-2">
                  <PiCalendarBold className="h-4 w-4 text-gray-400" />
                  <Text>{new Date(returnData.requestedAt).toLocaleString()}</Text>
                </div>
              </div>

              {returnData.completedAt && (
                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">Completed At</Text>
                  <div className="flex items-center gap-2">
                    <PiCalendarBold className="h-4 w-4 text-gray-400" />
                    <Text>{new Date(returnData.completedAt).toLocaleString()}</Text>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reason */}
            <div className="mt-6 pt-6 border-t border-muted">
              <Text className="mb-2 text-sm font-medium text-gray-500">Customer Reason</Text>
              <div className="flex items-start gap-2">
                <PiNoteBold className="mt-1 h-4 w-4 text-gray-400 flex-shrink-0" />
                <Text className="text-gray-700">{returnData.reason}</Text>
              </div>
            </div>

            {/* Admin Notes */}
            {returnData.adminNotes && (
              <div className="mt-4">
                <Text className="mb-2 text-sm font-medium text-gray-500">Admin Notes</Text>
                <div className="rounded bg-gray-50 p-4">
                  <Text className="text-gray-700">{returnData.adminNotes}</Text>
                </div>
              </div>
            )}
          </div>

          {/* Customer Information Card */}
          <div className="rounded-lg border border-muted bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <PiUserBold className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Text className="mb-1 text-sm font-medium text-gray-500">Name</Text>
                <Text className="font-semibold">
                  {returnData.customer.firstName} {returnData.customer.lastName}
                </Text>
              </div>

              <div>
                <Text className="mb-1 text-sm font-medium text-gray-500">Email</Text>
                <Text>{returnData.customer.email}</Text>
              </div>

              {returnData.customer.phoneNumber && (
                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">Phone</Text>
                  <Text>{returnData.customer.phoneNumber}</Text>
                </div>
              )}
            </div>
          </div>

          {/* Return Items Card */}
          <div className="rounded-lg border border-muted bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <PiPackageBold className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Return Items</h2>
            </div>

            <div className="space-y-4">
              {returnData.items.map((item: ReturnItem, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-4 pb-4',
                    index !== returnData.items.length - 1 && 'border-b border-muted'
                  )}
                >
                  <div className="flex-1">
                    <Text className="font-semibold">{item.productName}</Text>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: {formatCurrency(item.price)}</span>
                      {item.variant && <span>Variant: {item.variant}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-muted">
              <div className="flex justify-between">
                <Text className="font-semibold">Total Return Value</Text>
                <Text className="text-lg font-bold">
                  {formatCurrency(
                    returnData.items.reduce(
                      (sum: number, item: ReturnItem) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </Text>
              </div>
            </div>
          </div>

          {/* Refund Information (if processed) */}
          {returnData.refundStatus && (
            <div className="rounded-lg border border-muted bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">Refund Information</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">Refund Status</Text>
                  <Badge color="success" className="capitalize">
                    {returnData.refundStatus}
                  </Badge>
                </div>

                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">Refund Amount</Text>
                  <Text className="font-semibold text-lg">
                    {formatCurrency(returnData.refundAmount || 0)}
                  </Text>
                </div>

                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">Refund Method</Text>
                  <Text className="capitalize">{returnData.refundMethod || 'N/A'}</Text>
                </div>

                {returnData.refundTransactionId && (
                  <div>
                    <Text className="mb-1 text-sm font-medium text-gray-500">
                      Transaction ID
                    </Text>
                    <Text className="font-mono text-sm">{returnData.refundTransactionId}</Text>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="rounded-lg border border-muted bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Update Status</h3>

            {!showStatusForm ? (
              <Button
                onClick={() => setShowStatusForm(true)}
                className="w-full"
                variant="solid"
              >
                Change Status
              </Button>
            ) : (
              <div>
                <ReturnStatusUpdateForm
                  returnId={returnId}
                  currentStatus={returnData.status}
                  onSuccess={handleStatusUpdateSuccess}
                  onCancel={() => setShowStatusForm(false)}
                />
              </div>
            )}
          </div>

          {/* Refund Processing Card */}
          {canProcessRefund && (
            <div className="rounded-lg border border-muted bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Process Refund</h3>

              {!showRefundForm ? (
                <Button
                  onClick={() => setShowRefundForm(true)}
                  className="w-full"
                  variant="solid"
                >
                  Process Refund
                </Button>
              ) : (
                <div>
                  <RefundProcessForm
                    returnId={returnId}
                    totalRefundAmount={returnData.items.reduce(
                      (sum: number, item: ReturnItem) => sum + item.price * item.quantity,
                      0
                    )}
                    currentStatus={returnData.status}
                    onSuccess={handleRefundSuccess}
                    onCancel={() => setShowRefundForm(false)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Quick Info Card */}
          <div className="rounded-lg border border-muted bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <Text className="text-gray-500">Items Count</Text>
                <Text className="font-semibold">{returnData.items.length}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-500">Return Type</Text>
                <Text className="font-semibold capitalize">{returnData.type}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-500">Current Status</Text>
                <Badge color={getStatusColor(returnData.status)} size="sm" className="capitalize">
                  {returnData.status.replace('_', ' ')}
                </Badge>
              </div>
              {returnData.refundStatus && (
                <div className="flex justify-between">
                  <Text className="text-gray-500">Refund Status</Text>
                  <Badge color="success" size="sm" className="capitalize">
                    {returnData.refundStatus}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
