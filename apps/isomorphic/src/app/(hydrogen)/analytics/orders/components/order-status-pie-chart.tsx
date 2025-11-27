'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatNumber } from '@core/utils/format-number';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';

interface OrderStatusPieChartProps {
  data?: Array<{
    status: string;
    count: number;
  }>;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f97316', // Orange
  processing: '#3b82f6', // Blue
  completed: '#10b981', // Green
  cancelled: '#ef4444', // Red
  failed: '#6b7280', // Gray
};

export default function OrderStatusPieChart({
  data = [],
  isLoading,
}: OrderStatusPieChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Order Status Distribution" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  const chartData = data
    .filter((item) => item.status) // Filter out items with undefined status
    .map((item) => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count,
      color: STATUS_COLORS[item.status.toLowerCase()] || '#6b7280',
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetCard title="Order Status Distribution">
      {!chartData || chartData.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </div>
      ) : (
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                innerRadius="80%"
                outerRadius="100%"
                data={chartData}
                cx="50%"
                cornerRadius="10%"
                paddingAngle={1}
                cy="50%"
                labelLine={false}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                className="mt-4"
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry: any) => {
                  const percentage = (
                    (entry.payload.value / total) *
                    100
                  ).toFixed(1);
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
