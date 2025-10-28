'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumber } from '@core/utils/format-number';

import type { CategoriesPerformanceData } from '@/types/analytics.types';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';

interface CategoriesPerformanceChartProps {
  data?: CategoriesPerformanceData[];
  isLoading?: boolean;
}

export default function CategoriesPerformanceChart({
  data = [],
  isLoading,
}: CategoriesPerformanceChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Categories Performance" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Categories Performance"
      descriptionClassName="text-gray-500 mt-1.5 mb-3 @md:mb-0"
      headerClassName="flex-col @md:flex-row"
    >
      {!data || data.length === 0 ? (
        <div className="flex h-[420px] items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </div>
      ) : (
        <div className="mt-6 h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              margin={{ left: 30 }}
              className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12"
              data={data}
            >
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                dataKey="name"
                type="category"
              />
              <XAxis
                type="number"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `₦${formatNumber(value)}`}
              />

              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#0d7f11" radius={[0, 4, 4, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
