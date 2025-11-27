'use client';

import { Badge, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import MetricCard from '@core/components/cards/metric-card';
import { SalesOverviewResponse } from '@/types/analytics.types';

interface SalesOverviewCardsProps {
  data?: SalesOverviewResponse;
  isLoading?: boolean;
}

export default function SalesOverviewCards({
  data,
  isLoading,
}: SalesOverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 @md:grid-cols-2 @xl:grid-cols-4 2xl:gap-6 3xl:gap-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-300 bg-gray-0 p-5 dark:bg-gray-50"
          >
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
            <div className="h-8 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-gray-300 bg-gray-0 p-5 dark:bg-gray-50">
        <Text className="text-gray-500">No sales data available</Text>
      </div>
    );
  }

  // Get percentage change from API (already calculated)
  const percentageChange = data.comparisonPeriod?.percentageChange || 0;
  const isIncrease = percentageChange >= 0;

  const cards = [
    {
      id: 1,
      title: 'Total Revenue',
      metric: `₦${data.totalRevenue.toLocaleString()}`,
      increased: isIncrease,
      decreased: !isIncrease,
      percentage: `${Math.abs(percentageChange).toFixed(1)}%`,
    },
    {
      id: 2,
      title: 'Total Bought',
      metric: data.totalOrders.toLocaleString(),
      increased: isIncrease,
      decreased: !isIncrease,
      percentage: `${Math.abs(percentageChange).toFixed(1)}%`,
    },
    {
      id: 3,
      title: 'Average Order Value',
      metric: `₦${data.averageOrderValue.toLocaleString()}`,
      increased: true,
      percentage: '0%',
    },
    {
      id: 4,
      title: 'Revenue Change',
      metric: `₦${Math.abs(data.comparisonPeriod?.revenue || 0).toLocaleString()}`,
      increased: (data.comparisonPeriod?.revenue || 0) >= 0,
      decreased: (data.comparisonPeriod?.revenue || 0) < 0,
      percentage: `${Math.abs(percentageChange).toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 @md:grid-cols-2 @xl:grid-cols-4 2xl:gap-6 3xl:gap-8">
      {cards.map((stat) => (
        <MetricCard
          key={stat.id}
          title={stat.title}
          metric={stat.metric}
          metricClassName="text-[22px] 2xl:text-[26px]"
          className="border border-gray-300"
        >
          <Text className="mt-3 flex items-center gap-1 text-gray-500">
            <Badge
              renderAsDot
              className={cn(
                'scale-90',
                stat.increased && 'bg-green-dark',
                stat.decreased && 'bg-red-dark'
              )}
            />
            <Text
              as="span"
              className={cn(
                stat.increased && 'text-green-dark',
                stat.decreased && 'text-red-dark'
              )}
            >
              {stat.percentage}
            </Text>{' '}
            vs last period
          </Text>
        </MetricCard>
      ))}
    </div>
  );
}
