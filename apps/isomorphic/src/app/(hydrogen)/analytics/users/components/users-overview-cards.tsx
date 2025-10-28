'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Title, Text } from 'rizzui';
import { formatNumber } from '@core/utils/format-number';
import cn from '@core/utils/class-names';
import {
  PiUsersDuotone,
  PiUserPlusDuotone,
  PiUserCheckDuotone,
  PiUserMinusDuotone,
} from 'react-icons/pi';

interface UsersOverviewCardsProps {
  data?: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  isLoading?: boolean;
}

export default function UsersOverviewCards({
  data,
  isLoading,
}: UsersOverviewCardsProps) {
  const cards = [
    {
      title: 'Total Users',
      value: data?.totalUsers || 0,
      icon: PiUsersDuotone,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'New Users',
      value: data?.newUsers || 0,
      icon: PiUserPlusDuotone,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Users',
      value: data?.activeUsers || 0,
      icon: PiUserCheckDuotone,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Inactive Users',
      value: data?.inactiveUsers || 0,
      icon: PiUserMinusDuotone,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
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
