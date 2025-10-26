'use client';

import { useReturnsStatistics } from '@/hooks/queries/useReturnsStatistics';
import MetricCard from '@core/components/cards/metric-card';
import { PiArrowDown, PiArrowUp, PiPackage, PiCurrencyDollarDuotone } from 'react-icons/pi';

export default function ReturnStatisticsCards() {
  const { data: stats, isLoading } = useReturnsStatistics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Returns */}
      <MetricCard
        title="Total Returns"
        metric={stats?.total || 0}
        icon={<PiPackage className="h-7 w-7" />}
        iconClassName="bg-[#F0F1FF]"
      />

      {/* Pending Returns */}
      <MetricCard
        title="Pending Returns"
        metric={stats?.pending || 0}
        icon={<PiArrowUp className="h-6 w-6" />}
        iconClassName="bg-orange-lighter"
      />

      {/* Approved Returns */}
      <MetricCard
        title="Approved Returns"
        metric={stats?.approved || 0}
        icon={<PiArrowUp className="h-6 w-6" />}
        iconClassName="bg-green-lighter"
      />

      {/* Completed Returns */}
      <MetricCard
        title="Completed Returns"
        metric={stats?.completed || 0}
        icon={<PiArrowDown className="h-6 w-6" />}
        iconClassName="bg-blue-lighter"
      />

      {/* Total Refund Amount */}
      <MetricCard
        title="Total Refund Amount"
        metric={formatCurrency(stats?.totalRefundAmount || 0)}
        icon={<PiCurrencyDollarDuotone className="h-6 w-6" />}
        iconClassName="bg-blue-lighter"
      />
    </div>
  );
}
