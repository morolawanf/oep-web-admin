/**
 * Reviews Analytics Client Component
 *
 * Displays comprehensive review analytics including:
 * - Overview metrics (total reviews, average rating, positive/negative)
 * - Rating distribution breakdown (1-5 stars)
 * - Review sentiment trend over time
 * - Detailed reviews table with filters
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { DatePicker } from '@core/ui/datepicker';
import { Text } from 'rizzui';
import {
  useReviewsOverview,
  useRatingDistribution,
  useReviewSentiment,
  useReviewsTable,
} from '@/hooks/queries/analytics';
import ReviewsOverviewCards from './components/reviews-overview-cards';
import RatingDistributionChart from './components/rating-distribution-chart';
import ReviewSentimentChart from './components/review-sentiment-chart';
import ReviewsDataTable from './components/reviews-data-table';

const pageHeader = {
  title: 'Reviews Analytics',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/analytics',
      name: 'Analytics',
    },
    {
      name: 'Reviews',
    },
  ],
};

export default function ReviewsAnalyticsClient() {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<'days' | 'months' | 'years'>('days');

  // Table pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Format dates for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Fetch data
  const { data: overview, isLoading: loadingOverview } =
    useReviewsOverview(dateParams);
  const { data: ratingDist, isLoading: loadingRating } =
    useRatingDistribution(dateParams);
  const { data: sentiment, isLoading: loadingSentiment } = useReviewSentiment({
    ...dateParams,
    groupBy,
  });
  const { data: reviews, isLoading: loadingReviews } = useReviewsTable({
    ...dateParams,
    page,
    limit,
    rating: ratingFilter === 'all' ? undefined : Number(ratingFilter),
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  console.log({ reviews });

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      {/* Date Range Selector */}
      <div className="mb-6 flex items-center gap-4">
        <div>
          <Text className="mb-1 text-sm font-medium">From</Text>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => date && setStartDate(date)}
            placeholderText="Select start date"
            dateFormat="MMM dd, yyyy"
            className="w-full"
          />
        </div>
        <div>
          <Text className="mb-1 text-sm font-medium">To</Text>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            placeholderText="Select end date"
            dateFormat="MMM dd, yyyy"
            minDate={startDate}
            className="w-full"
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mb-6">
        <ReviewsOverviewCards data={overview} isLoading={loadingOverview} />
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 @container lg:grid-cols-2">
        <RatingDistributionChart
          data={ratingDist || []}
          isLoading={loadingRating}
        />
        <ReviewSentimentChart
          data={sentiment || []}
          isLoading={loadingSentiment}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
        />
      </div>

      {/* Reviews Table */}
      <ReviewsDataTable
        data={reviews}
        onPageChange={setPage}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onRatingFilter={(rating: string) => {
          setRatingFilter(rating);
          setPage(1);
        }}
        onStatusFilter={(status: string) => {
          setStatusFilter(status);
          setPage(1);
        }}
        selectedRating={ratingFilter}
        selectedStatus={statusFilter}
        isLoading={loadingReviews}
      />
    </>
  );
}
