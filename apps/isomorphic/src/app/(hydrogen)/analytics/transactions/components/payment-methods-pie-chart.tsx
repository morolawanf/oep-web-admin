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

interface PaymentMethodsPieChartProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
  isLoading?: boolean;
}

const METHOD_COLORS: Record<string, string> = {
  paystack: '#3b82f6', // Blue
  stripe: '#10b981', // Green
  flutterwave: '#f59e0b', // Amber
  bank_transfer: '#8b5cf6', // Purple
  cash_on_delivery: '#6b7280', // Gray
  store_credit: '#ec4899', // Pink
  original_payment: '#14b8a6', // Teal
};

export default function PaymentMethodsPieChart({
  data = [],
  isLoading,
}: PaymentMethodsPieChartProps) {
  if (isLoading) {
    return (
      <WidgetCard title="Payment Methods Distribution" className="h-[400px]">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: item.value,
    color: METHOD_COLORS[item.name.toLowerCase()] || '#6b7280',
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetCard title="Payment Methods Distribution">
      {!chartData || chartData.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </div>
      ) : (
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className="[&_.recharts-sector:focus]:outline-none">
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={116}
                labelLine={false}
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
                  const percentage = (
                    (entry.payload.value / total) *
                    100
                  ).toFixed(1);
                  return `${value}`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
