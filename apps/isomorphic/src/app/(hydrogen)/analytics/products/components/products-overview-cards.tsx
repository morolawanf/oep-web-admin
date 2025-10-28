'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Title, Text } from 'rizzui';
import { formatNumber } from '@core/utils/format-number';
import cn from '@core/utils/class-names';
import {
  PiPackageDuotone,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
  PiWarningDuotone,
} from 'react-icons/pi';

interface ProductsOverviewCardsProps {
  data?: {
    totalProducts: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
  };
  isLoading?: boolean;
}

export default function ProductsOverviewCards({
  data,
  isLoading,
}: ProductsOverviewCardsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: data?.totalProducts || 0,
      icon: PiPackageDuotone,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'In Stock',
      value: data?.inStock || 0,
      icon: PiCheckCircleDuotone,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Out of Stock',
      value: data?.outOfStock || 0,
      icon: PiXCircleDuotone,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Low Stock',
      value: data?.lowStock || 0,
      icon: PiWarningDuotone,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

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
      {cards.map((card, index) => (
        <WidgetCard key={index}>
          <div className="flex items-center justify-between">
            <div>
              <Text className="mb-1 text-sm text-gray-500">{card.title}</Text>
              <Title as="h3" className="text-2xl font-bold">
                {formatNumber(card.value)}
              </Title>
            </div>
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', card.bgColor)}>
              <card.icon className={cn('h-6 w-6', card.iconColor)} />
            </div>
          </div>
        </WidgetCard>
      ))}
    </div>
  );
}
