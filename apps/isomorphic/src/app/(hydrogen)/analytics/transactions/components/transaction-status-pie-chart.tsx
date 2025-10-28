'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '@core/utils/format-number';

interface TransactionStatusPieChartProps {
  data?: Array<{
    status: string;
    count: number;
  }>;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f97316', // Orange
  completed: '#10b981', // Green
  failed: '#ef4444', // Red
  cancelled: '#6b7280', // Gray
  refunded: '#8b5cf6', // Purple
  partially_refunded: '#a855f7', // Light Purple
};

export default function TransactionStatusPieChart({
  data = [],
  isLoading,
}: TransactionStatusPieChartProps) {
  if (isLoading) {
    return (
      <WidgetCard
        title="Transaction Status Distribution"
        className="h-[400px]"
      >
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  const chartData = data
    .filter((item) => item.status) // Filter out items with undefined status
    .map((item) => ({
      name: item.status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      value: item.count,
      color: STATUS_COLORS[item.status.toLowerCase()] || '#6b7280',
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetCard title="Transaction Status Distribution">
      {!chartData || chartData.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </div>
      ) : (
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const data = payload[0].payload;
                  const percentage = ((data.value / total) * 100).toFixed(1);

                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="mb-1 text-sm font-medium text-gray-900">
                        {data.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(data.value)} transactions ({percentage}%)
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry: any) => {
                  const percentage = ((entry.payload.value / total) * 100).toFixed(1);
                  return `${value} (${percentage}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
