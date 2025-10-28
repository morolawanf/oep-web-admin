'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import cn from '@core/utils/class-names';

interface TransactionStatusBarChartProps {
  data?: Array<{
    date: string;
    pending: number;
    completed: number;
    failed: number;
    cancelled: number;
    refunded: number;
    partially_refunded: number;
  }>;
  groupBy: 'days' | 'months' | 'years';
  onGroupByChange: (groupBy: 'days' | 'months' | 'years') => void;
  isLoading?: boolean;
}

export default function TransactionStatusBarChart({
  data = [],
  groupBy,
  onGroupByChange,
  isLoading,
}: TransactionStatusBarChartProps) {
  const groupByOptions = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ] as const;

  if (isLoading) {
    return (
      <WidgetCard title="Transaction Status Distribution" className="h-[450px]">
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

  // Status configuration with colors
  const statusConfig = [
    { key: 'pending', label: 'Pending', color: '#f59e0b' },
    { key: 'completed', label: 'Completed', color: '#10b981' },
    { key: 'failed', label: 'Failed', color: '#ef4444' },
    { key: 'cancelled', label: 'Cancelled', color: '#6b7280' },
    { key: 'refunded', label: 'Refunded', color: '#8b5cf6' },
    { key: 'partially_refunded', label: 'Partial Refund', color: '#a78bfa' },
  ];

  return (
    <WidgetCard
      title="Transaction Status Distribution"
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
        <div className="flex h-[370px] items-center justify-center">
          <Text className="text-gray-500">No data available for the selected period</Text>
        </div>
      ) : (
        <div className="mt-6 h-[370px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
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
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;

                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="mb-2 text-sm font-semibold text-gray-900">
                        {formatXAxis(label)}
                      </p>
                      <div className="space-y-1">
                        {payload.map((entry: any) => {
                          const status = statusConfig.find(s => s.key === entry.dataKey);
                          if (!status || entry.value === 0) return null;
                          
                          return (
                            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-sm"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-gray-600">{status.label}</span>
                              </div>
                              <span className="text-xs font-semibold text-gray-900">
                                {entry.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
                formatter={(value) => {
                  const status = statusConfig.find(s => s.key === value);
                  return <span className="text-sm text-gray-600">{status?.label || value}</span>;
                }}
              />
              {statusConfig.map((status) => (
                <Bar
                  key={status.key}
                  dataKey={status.key}
                  stackId="status"
                  fill={status.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
