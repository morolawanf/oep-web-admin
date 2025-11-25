import { Badge } from 'rizzui/badge';
import { formatDate } from '@core/utils/format-date';
import type { Order } from '@/types/order.types';

interface InvoiceDetailsProps {
  order: Order;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default function InvoiceDetails({ order }: InvoiceDetailsProps) {
  const shipment = order.shipment;

  return (
    <div className="grid items-start rounded-xl border border-gray-300 p-5 @2xl:grid-cols-2 @3xl:grid-cols-3 @3xl:p-8 @5xl:grid-cols-4">
      <ul className="grid gap-3 @3xl:col-span-full @3xl:mb-2 @5xl:col-span-1 @5xl:mb-0">
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Order Number :</span>
          <span className="text-base font-semibold text-gray-900">
            #{order.orderNumber}
          </span>
        </li>
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Order Status :</span>
          <Badge color={getStatusColor(order.status)} rounded="md">
            {order.status}
          </Badge>
        </li>
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Payment Status :</span>
          <Badge color={getPaymentStatusColor(order.transaction?.status || 'pending')} rounded="md">
            {order.transaction?.status || 'Pending'}
          </Badge>
        </li>
      </ul>

      {/* Order Details */}
      <ul className="mt-3 grid gap-3 @5xl:mt-0">
        <li className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">Order Date :</span>
          <span>{formatDate(new Date(order.createdAt), 'MMM DD, YYYY')}</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">Delivery Type :</span>
          <span className="capitalize">{order.deliveryType}</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">Total Amount :</span>
          <span>₦{order.total.toLocaleString()}</span>
        </li>
      </ul>

      {/* Payment Details */}
      <ul className="mt-3 grid gap-3 @5xl:mt-0">
        <li className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">Payment Method :</span>
          <span className="capitalize">{order.transaction?.paymentMethod || 'N/A'}</span>
        </li>
        {order.transaction?.paymentGateway && (
          <li className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Payment Gateway :</span>
            <span className="capitalize">{order.transaction.paymentGateway}</span>
          </li>
        )}
        {order.paidAt && (
          <li className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Paid At :</span>
            <span>{formatDate(new Date(order.paidAt), 'MMM DD, YYYY')}</span>
          </li>
        )}
      </ul>

      {/* Shipment Details (only if shipping) */}
      {shipment && order.deliveryType === 'shipping' && (
        <ul className="mt-3 grid gap-3 @5xl:mt-0">
          <li className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Tracking Number :</span>
            <span>{shipment.trackingNumber || 'N/A'}</span>
          </li>
          {shipment.courier && (
            <li className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">Courier :</span>
              <span className="capitalize">{shipment.courier}</span>
            </li>
          )}
          {shipment.status && (
            <li className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">Shipment Status :</span>
              <Badge color={getStatusColor(shipment.status)} rounded="md">
                {shipment.status}
              </Badge>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
