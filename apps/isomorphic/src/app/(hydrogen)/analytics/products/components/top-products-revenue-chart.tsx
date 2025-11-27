'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumber } from '@core/utils/format-number';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { TopProductsRevenueData } from '@/types/analytics.types';

interface TopProductsRevenueChartProps {
  data?: TopProductsRevenueData[];
  isLoading?: boolean;
}

export default function TopProductsRevenueChart({
  data = [],
  isLoading,
}: TopProductsRevenueChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Top Products by Revenue" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  // Truncate long product names for better chart display
  const chartData = data.map((item) => ({
    ...item,
    displayName:
      item.productName.length > 20
        ? item.productName.substring(0, 17) + '...'
        : item.productName,
  }));

  return (
    <WidgetCard
      title="Top 10 Products by Revenue"
      descriptionClassName="text-gray-500 mt-1.5 mb-3 @md:mb-0"
      headerClassName="flex-col @md:flex-row"
    >
      {!chartData || chartData.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </div>
      ) : (
        <div className="mt-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              margin={{ left: 12 }}
              data={chartData}
              className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12"
            >
              <XAxis
                type="number"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `₦${formatNumber(value)}`}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#2f0d7f" radius={[0, 4, 4, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
