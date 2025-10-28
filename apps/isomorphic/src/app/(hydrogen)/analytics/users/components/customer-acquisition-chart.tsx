'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import cn from '@core/utils/class-names';

interface CustomerAcquisitionChartProps {
  data?: Array<{
    date: string;
    count: number;
  }>;
  groupBy: 'days' | 'months' | 'years';
  onGroupByChange: (groupBy: 'days' | 'months' | 'years') => void;
  isLoading?: boolean;
}

export default function CustomerAcquisitionChart({
  data = [],
  groupBy,
  onGroupByChange,
  isLoading,
}: CustomerAcquisitionChartProps) {
  const groupByOptions = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ] as const;

  if (isLoading) {
    return (
      <WidgetCard title="Customer Acquisition" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  const formatXAxis = (value: string) => {
    if (!value) return '';
    
    if (groupBy === 'days') {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (groupBy === 'months') {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else {
      const date = new Date(value);
      return date.getFullYear().toString();
    }
  };

  return (
    <WidgetCard
      title="Customer Acquisition"
      headerClassName="items-center"
      action={
        <div className="flex gap-2">
          {groupByOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onGroupByChange(option.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                groupBy === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      {!data || data.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <Text className="text-gray-500">No data available for the selected period</Text>
        </div>
      ) : (
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="mb-1 text-xs text-gray-500">
                        {formatXAxis(data.date)}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {payload[0].value} new users
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#usersGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
