/**
 * TimeSeriesChart Component
 * 
 * Reusable time-series chart with groupBy toggle (Days/Weeks/Months/Years).
 * Displays data from legacy analytics endpoints with dynamic time period selection.
 * 
 * Features:
 * - Toggle buttons for time period (Days/Weeks/Months/Years)
 * - Responsive Recharts area chart with gradient fills
 * - Loading and empty states
 * - Automatic data formatting based on groupBy
 * - Customizable title and description
 */

'use client';

import { useState } from 'react';
import WidgetCard from '@core/components/cards/widget-card';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { LegacyTimeSeriesDataPoint } from '@/types/analytics.types';
import { Text, Button } from 'rizzui';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumber } from '@core/utils/format-number';

type GroupByPeriod = 'days' | 'weeks' | 'months' | 'years';

interface TimeSeriesChartProps {
  title: string;
  description?: string;
  data: LegacyTimeSeriesDataPoint[];
  isLoading?: boolean;
  groupBy: GroupByPeriod;
  onGroupByChange: (period: GroupByPeriod) => void;
  dataKey?: string; // The key to chart (default: 'count')
  yAxisFormatter?: (value: number) => string; // Custom Y-axis formatter
  tooltipFormatter?: (value: number) => string; // Custom tooltip formatter
  color?: string; // Chart color (default: '#3b82f6')
  height?: number; // Chart height in pixels (default: 320)
}

export default function TimeSeriesChart({
  title,
  description,
  data,
  isLoading = false,
  groupBy,
  onGroupByChange,
  dataKey = 'count',
  yAxisFormatter,
  tooltipFormatter,
  color = '#3b82f6',
  height = 320,
}: TimeSeriesChartProps) {
  /**
   * Format data point for X-axis display based on groupBy
   */
  const formatXAxisLabel = (dataPoint: LegacyTimeSeriesDataPoint): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (groupBy === 'years') {
      return dataPoint.year.toString();
    } else if (groupBy === 'months' && dataPoint.month) {
      return `${monthNames[dataPoint.month - 1]} ${dataPoint.year}`;
    } else if (groupBy === 'days' && dataPoint.month && dataPoint.day) {
      return `${monthNames[dataPoint.month - 1]} ${dataPoint.day}`;
    } else if (groupBy === 'weeks' && dataPoint.month && dataPoint.day) {
      // For weeks, show the start date of the week
      return `${monthNames[dataPoint.month - 1]} ${dataPoint.day}`;
    }
    
    return '';
  };

  /**
   * Transform data for Recharts consumption
   */
  const chartData = data.map((point) => ({
    ...point,
    label: formatXAxisLabel(point),
    value: point[dataKey as keyof LegacyTimeSeriesDataPoint] as number,
  }));

  /**
   * Default Y-axis formatter (thousands notation)
   */
  const defaultYAxisFormatter = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  /**
   * Default tooltip formatter (comma-separated)
   */
  const defaultTooltipFormatter = (value: number) => {
    return formatNumber(value);
  };

  // Loading state
  if (isLoading) {
    return (
      <WidgetCard title={title} className="@container">
        <div className={`h-[${height}px] flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </WidgetCard>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <WidgetCard title={title} className="@container">
        <div className={`h-[${height}px] flex items-center justify-center`}>
          <Text className="text-gray-500">No data available for the selected period</Text>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title={title}
      description={description}
      className="@container"
      headerClassName="items-start"
      action={
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={groupBy === 'days' ? 'solid' : 'outline'}
            onClick={() => onGroupByChange('days')}
            className="px-3"
          >
            Days
          </Button>
          <Button
            size="sm"
            variant={groupBy === 'weeks' ? 'solid' : 'outline'}
            onClick={() => onGroupByChange('weeks')}
            className="px-3"
          >
            Weeks
          </Button>
          <Button
            size="sm"
            variant={groupBy === 'months' ? 'solid' : 'outline'}
            onClick={() => onGroupByChange('months')}
            className="px-3"
          >
            Months
          </Button>
          <Button
            size="sm"
            variant={groupBy === 'years' ? 'solid' : 'outline'}
            onClick={() => onGroupByChange('years')}
            className="px-3"
          >
            Years
          </Button>
        </div>
      }
    >
      <div className="mt-5 w-full" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              left: -10,
              right: 5,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id={`color-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              angle={groupBy === 'days' ? -45 : 0}
              textAnchor={groupBy === 'days' ? 'end' : 'middle'}
              height={groupBy === 'days' ? 80 : 60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={yAxisFormatter || defaultYAxisFormatter}
            />
            <Tooltip
              content={
                <CustomTooltip
                  formatter={(value: number) => (tooltipFormatter || defaultTooltipFormatter)(value)}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${title.replace(/\s+/g, '-')})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats below chart */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
        <div>
          <Text className="text-sm text-gray-600">Total</Text>
          <Text className="text-2xl font-semibold">
            {formatNumber(chartData.reduce((sum, point) => sum + point.value, 0))}
          </Text>
        </div>
        <div>
          <Text className="text-sm text-gray-600">Average</Text>
          <Text className="text-2xl font-semibold">
            {formatNumber(Math.round(chartData.reduce((sum, point) => sum + point.value, 0) / chartData.length))}
          </Text>
        </div>
      </div>
    </WidgetCard>
  );
}
