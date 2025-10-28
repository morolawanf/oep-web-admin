'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { formatNumber } from '@core/utils/format-number';

interface RatingDistributionChartProps {
  data?: Array<{
    rating: number;
    count: number;
  }>;
  isLoading?: boolean;
}

const RATING_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'];

export default function RatingDistributionChart({
  data = [],
  isLoading,
}: RatingDistributionChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Rating Distribution" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  // Ensure we have all ratings from 1-5
  const chartData = [1, 2, 3, 4, 5].map(rating => {
    const found = data.find(d => d.rating === rating);
    return {
      rating,
      count: found?.count || 0,
      label: `${rating} Star${rating !== 1 ? 's' : ''}`,
    };
  });

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <WidgetCard title="Rating Distribution">
      {!data || data.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </div>
      ) : (
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
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
                  const percentage = total > 0 ? ((data.count / total) * 100).toFixed(1) : '0.0';

                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="mb-1 text-sm font-medium text-gray-900">
                        {data.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(data.count)} reviews ({percentage}%)
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RATING_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
