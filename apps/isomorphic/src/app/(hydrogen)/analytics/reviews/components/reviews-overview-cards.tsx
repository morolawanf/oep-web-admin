'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { Title, Text } from 'rizzui';
import { formatNumber } from '@core/utils/format-number';
import cn from '@core/utils/class-names';
import {
  PiStarDuotone,
  PiChartBarDuotone,
  PiThumbsUpDuotone,
  PiThumbsDownDuotone,
  PiStar,
  PiStarFill,
} from 'react-icons/pi';
interface ReviewsOverviewCardsProps {
  data?: {
    totalReviews: number;
    averageRating: number;
    positiveReviews: number;
    negativeReviews: number;
  };
  isLoading?: boolean;
}

const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= Math.floor(rating) ? (
        <PiStarFill key={i} className="h-5 w-5 text-yellow-500" />
      ) : (
        <PiStar key={i} className="h-5 w-5 text-gray-300" />
      )
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

export default function ReviewsOverviewCards({
  data,
  isLoading,
}: ReviewsOverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <WidgetCard key={i} className="h-28 animate-pulse">
            <div className="h-full rounded bg-gray-100"></div>
          </WidgetCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-4">
      {/* Total Reviews */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Total Reviews</Text>
            <Title as="h3" className="text-2xl font-bold">
              {formatNumber(data?.totalReviews || 0)}
            </Title>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'
            )}
          >
            <PiChartBarDuotone className={cn('h-6 w-6 text-blue-600')} />
          </div>
        </div>
      </WidgetCard>

      {/* Average Rating */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Average Rating</Text>
            <div className="flex items-center gap-2">
              <Title as="h3" className="text-2xl font-bold">
                {data?.averageRating?.toFixed(1) || '0.0'}
              </Title>
              <RatingStars rating={data?.averageRating || 0} />
            </div>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100'
            )}
          >
            <PiStarDuotone className={cn('h-6 w-6 text-yellow-600')} />
          </div>
        </div>
      </WidgetCard>

      {/* Positive Reviews */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Positive (4-5★)</Text>
            <Title as="h3" className="text-2xl font-bold">
              {formatNumber(data?.positiveReviews || 0)}
            </Title>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'
            )}
          >
            <PiThumbsUpDuotone className={cn('h-6 w-6 text-green-600')} />
          </div>
        </div>
      </WidgetCard>

      {/* Negative Reviews */}
      <WidgetCard>
        <div className="flex items-center justify-between">
          <div>
            <Text className="mb-1 text-sm text-gray-500">Negative (1-2★)</Text>
            <Title as="h3" className="text-2xl font-bold">
              {formatNumber(data?.negativeReviews || 0)}
            </Title>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg bg-red-100'
            )}
          >
            <PiThumbsDownDuotone className={cn('h-6 w-6 text-red-600')} />
          </div>
        </div>
      </WidgetCard>
    </div>
  );
}
