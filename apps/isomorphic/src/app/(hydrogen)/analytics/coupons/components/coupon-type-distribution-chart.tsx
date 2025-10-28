'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CouponTypeDistributionChartProps {
  data?: Array<{
    type: string;
    count: number;
  }>;
  isLoading?: boolean;
}

const COUPON_TYPE_COLORS: Record<string, string> = {
  percentage: '#3b82f6',
  fixed: '#10b981',
};

const TYPE_LABELS: Record<string, string> = {
  percentage: 'Percentage Discount',
  fixed: 'Fixed Amount',
};

export default function CouponTypeDistributionChart({
  data = [],
  isLoading,
}: CouponTypeDistributionChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Coupon Type Distribution" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    label: TYPE_LABELS[item.type] || item.type,
    color: COUPON_TYPE_COLORS[item.type] || '#6b7280',
  }));

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <WidgetCard title="Coupon Type Distribution">
      {!data || data.length === 0 ? (
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
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const data = payload[0].payload;
                  const percentage = total > 0 ? ((data.count / total) * 100).toFixed(1) : '0.0';

                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="mb-1 text-sm font-medium text-gray-900">
                        {data.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {data.count} coupons ({percentage}%)
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <div className="flex justify-center gap-6 mt-4">
                    {payload?.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        <Text className="text-sm text-gray-600">{entry.value}</Text>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
