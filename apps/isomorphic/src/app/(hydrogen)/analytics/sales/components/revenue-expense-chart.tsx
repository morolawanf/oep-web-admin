'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { RevenueExpenseChartData } from '@/types/analytics.types';
import { Text } from 'rizzui';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatCurrencyShort,
} from '@/utils/format-currency';

interface RevenueExpenseChartProps {
  data: RevenueExpenseChartData[];
  isLoading?: boolean;
}

export default function RevenueExpenseChart({
  data,
  isLoading,
}: RevenueExpenseChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Revenue vs Returns" className="@container">
        <div className="flex h-80 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </WidgetCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <WidgetCard title="Revenue vs Returns" className="@container">
        <div className="flex h-80 items-center justify-center">
          <Text className="text-gray-500">
            No data available for the selected period
          </Text>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Revenue vs Returns"
      description="Monthly revenue and returns comparison"
      className="@container"
    >
      <div className="mt-5 h-80 w-full @sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              left: -10,
              right: 5,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${formatCurrencyShort(value)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              xlinkTitle="returns"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
