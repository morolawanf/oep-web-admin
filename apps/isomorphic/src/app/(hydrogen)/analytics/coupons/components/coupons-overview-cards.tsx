'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Title, Text } from 'rizzui';
import { formatNumber } from '@core/utils/format-number';
import { formatCurrency } from '@core/utils/format-currency';
import cn from '@core/utils/class-names';
import {
  PiTicketDuotone,
  PiCheckCircleDuotone,
  PiChartLineDuotone,
  PiCurrencyDollarDuotone,
} from 'react-icons/pi';

interface CouponsOverviewCardsProps {
  data?: {
    totalCoupons: number;
    activeCoupons: number;
    totalRedemptions: number;
    totalDiscountGiven: number;
  };
  isLoading?: boolean;
}

export default function CouponsOverviewCards({
  data,
  isLoading,
}: CouponsOverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <WidgetCard key={i} className="h-28 animate-pulse">
            <div className="h-full bg-gray-100 rounded"></div>
          </WidgetCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-4">
      {/* Total Coupons */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Total Coupons</Text>
            <Title as="h3" className="text-2xl font-bold">
              {formatNumber(data?.totalCoupons || 0)}
            </Title>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100')}>
            <PiTicketDuotone className={cn('h-6 w-6 text-blue-600')} />
          </div>
        </div>
      </WidgetCard>

      {/* Active Coupons */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Active Coupons</Text>
            <Title as="h3" className="text-2xl font-bold">
              {formatNumber(data?.activeCoupons || 0)}
            </Title>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg bg-green-100')}>
            <PiCheckCircleDuotone className={cn('h-6 w-6 text-green-600')} />
          </div>
        </div>
      </WidgetCard>

      {/* Total Redemptions */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Total Redemptions</Text>
            <Title as="h3" className="text-2xl font-bold">
              {formatNumber(data?.totalRedemptions || 0)}
            </Title>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100')}>
            <PiChartLineDuotone className={cn('h-6 w-6 text-purple-600')} />
          </div>
        </div>
      </WidgetCard>

      {/* Total Discount Given */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Total Discount</Text>
            <Title as="h3" className="text-2xl font-bold">
              {formatCurrency(data?.totalDiscountGiven || 0)}
            </Title>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100')}>
            <PiCurrencyDollarDuotone className={cn('h-6 w-6 text-orange-600')} />
          </div>
        </div>
      </WidgetCard>
    </div>
  );
}
