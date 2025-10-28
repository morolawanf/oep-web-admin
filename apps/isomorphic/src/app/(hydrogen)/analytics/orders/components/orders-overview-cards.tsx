'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { OrdersOverviewResponse } from '@/types/analytics.types';
import { Text, Title } from 'rizzui';
import { PiShoppingCartDuotone, PiClockDuotone, PiCheckCircleDuotone, PiXCircleDuotone } from 'react-icons/pi';
import { formatNumber } from '@core/utils/format-number';
import cn from '@core/utils/class-names';

interface OrdersOverviewCardsProps {
  data?: OrdersOverviewResponse;
  isLoading?: boolean;
}

export default function OrdersOverviewCards({ data, isLoading }: OrdersOverviewCardsProps) {
  const cards = [
    {
      title: 'Total Orders',
      value: data?.totalOrders || 0,
      icon: <PiShoppingCartDuotone className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending',
      value: data?.pending || 0,
      icon: <PiClockDuotone className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Completed',
      value: data?.completed || 0,
      icon: <PiCheckCircleDuotone className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Cancelled',
      value: data?.cancelled || 0,
      icon: <PiXCircleDuotone className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <WidgetCard key={i} className="@container">
            <div className="flex h-24 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </WidgetCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <WidgetCard key={index} className="@container">
          <div className="flex items-start justify-between">
            <div>
              <Text className="mb-2 text-sm text-gray-600">{card.title}</Text>
              <Title className="text-3xl font-semibold">{formatNumber(card.value)}</Title>
            </div>
            <div className={cn('rounded-lg p-3', card.bgColor)}>
              <div className={card.color}>{card.icon}</div>
            </div>
          </div>
        </WidgetCard>
      ))}
    </div>
  );
}
