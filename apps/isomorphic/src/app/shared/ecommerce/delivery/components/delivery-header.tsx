'use client';

import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { useMyDeliveryStats } from '@/hooks/queries/useDeliveries';
import { Badge } from 'rizzui';

export default function DeliveryHeader() {
  const { data: stats } = useMyDeliveryStats();

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Deliveries"
        breadcrumb={[
          { href: routes.eCommerce.dashboard, name: 'E-Commerce' },
          { name: 'Delivery' },
        ]}
      />
      {/* Tiny stats row */}
      <div className="grid grid-cols-2 gap-3 @md:grid-cols-3 @xl:grid-cols-6">
        <Stat label="In Warehouse" value={stats?.['In-Warehouse'] ?? 0} />
        <Stat label="Shipped" value={stats?.Shipped ?? 0} />
        <Stat label="Dispatched" value={stats?.Dispatched ?? 0} />
        <Stat label="Delivered" value={stats?.Delivered ?? 0} />
        <Stat label="Returned" value={stats?.Returned ?? 0} />
        <Stat label="Failed" value={stats?.Failed ?? 0} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
      <span className="text-xs text-gray-600">{label}</span>
      <Badge color="secondary" variant="flat" className="text-sm">
        {value}
      </Badge>
    </div>
  );
}
