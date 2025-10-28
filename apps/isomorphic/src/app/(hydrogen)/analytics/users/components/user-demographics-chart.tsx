'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNumber } from '@core/utils/format-number';

interface UserDemographicsChartProps {
  data?: Array<{
    country: string;
    count: number;
  }>;
  isLoading?: boolean;
}

export default function UserDemographicsChart({
  data = [],
  isLoading,
}: UserDemographicsChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="User Demographics" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  // Show top 10 countries
  const topCountries = data.slice(0, 10);

  return (
    <WidgetCard title="User Demographics - Top 10 Countries">
      {!topCountries || topCountries.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </div>
      ) : (
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCountries}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="country"
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
                      <p className="mb-1 text-sm font-medium text-gray-900">
                        {data.country}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(data.count)} users
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
