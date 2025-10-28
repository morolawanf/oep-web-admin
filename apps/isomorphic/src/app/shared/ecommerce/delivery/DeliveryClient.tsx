'use client';

import DeliveryTable from './components/delivery-table';
import DeliveryStatsRow from './components/delivery-stats-row';

export default function DeliveryClient() {
  return (
    <div className="@container space-y-4">
      <DeliveryStatsRow />
      <DeliveryTable />
    </div>
  );
}
