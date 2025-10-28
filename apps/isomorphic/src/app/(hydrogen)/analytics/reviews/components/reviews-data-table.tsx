'use client';

import { useState } from 'react';
import WidgetCard from '@core/components/cards/widget-card';
import { Badge, Button, Select, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCaretUpDownBold,
  PiStar,
  PiStarFill,
} from 'react-icons/pi';
import type { ReviewsTableResponse, ReviewTableRow } from '@/types/analytics.types';

interface ReviewsDataTableProps {
  // Accept backend-shaped response: { data: ReviewTableRow[], pagination }
  data?: ReviewsTableResponse;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRatingFilter: (rating: string) => void;
  onStatusFilter: (status: string) => void;
  selectedRating: string;
  selectedStatus: string;
  isLoading?: boolean;
}

const RATING_OPTIONS = [
  { label: 'All Ratings', value: 'all' },
  { label: '5 Stars', value: '5' },
  { label: '4 Stars', value: '4' },
  { label: '3 Stars', value: '3' },
  { label: '2 Stars', value: '2' },
  { label: '1 Star', value: '1' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const LIMIT_OPTIONS = [
  { label: '10 rows', value: '10' },
  { label: '20 rows', value: '20' },
  { label: '50 rows', value: '50' },
];

const getStatusBadgeColor = (status: string | undefined): 'success' | 'warning' | 'danger' | 'secondary' => {
  if (!status) return 'secondary';
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
};

const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? (
        <PiStarFill key={i} className="h-4 w-4 text-yellow-500" />
      ) : (
        <PiStar key={i} className="h-4 w-4 text-gray-300" />
      )
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

export default function ReviewsDataTable({
  data,
  onPageChange,
  onLimitChange,
  onRatingFilter,
  onStatusFilter,
  selectedRating,
  selectedStatus,
  isLoading,
}: ReviewsDataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <PiCaretUpDownBold className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <PiCaretUpBold className="h-4 w-4" />
    ) : (
      <PiCaretDownBold className="h-4 w-4" />
    );
  };

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  if (isLoading) {
    return (
      <WidgetCard title="Reviews Data" className="mt-6">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        </div>
      </WidgetCard>
    );
  }

  // Support backend response shape (data + pagination)
  const reviews: ReviewTableRow[] = data?.data || [];
  const total = data?.pagination?.totalRecords || 0;
  const currentPage = data?.pagination?.currentPage || 1;
  const limit = data?.pagination && data.pagination.totalPages
    ? Math.ceil(data.pagination.totalRecords / data.pagination.totalPages)
    : 10;
  const totalPages = data?.pagination?.totalPages || Math.ceil(total / limit || 1);

  return (
    <WidgetCard
      title="Reviews Data"
      className="mt-6"
      headerClassName="items-center"
      action={
        <div className="flex gap-3">
          <Select
            value={selectedRating}
            options={RATING_OPTIONS}
            onChange={(value) => onRatingFilter(value as string)}
            className="w-36"
            placeholder="Filter by rating"
          />
          <Select
            value={selectedStatus}
            options={STATUS_OPTIONS}
            onChange={(value) => onStatusFilter(value as string)}
            className="w-40"
            placeholder="Filter by status"
          />
          <Select
            value={limit.toString()}
            options={LIMIT_OPTIONS}
            onChange={(value) => onLimitChange(Number(value))}
            className="w-32"
          />
        </div>
      }
    >
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('productName')}
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                >
                  Product {getSortIcon('productName')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('customerName')}
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                >
                  Customer {getSortIcon('customerName')}
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-semibold text-gray-700">Rating</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">Comment</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">Status</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                >
                  Date {getSortIcon('createdAt')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <Text className="text-gray-500">No reviews found</Text>
                </td>
              </tr>
            ) : (
              reviews.map((review, index) => {
                const isExpanded = expandedReviews.has(review._id);
                const comment = review.comment || '';
                const commentPreview = comment.length > 60 
                  ? comment.substring(0, 57) + '...'
                  : comment;

                return (
                  <tr
                    key={review._id}
                    className={cn(
                      'border-b border-gray-100 transition-colors hover:bg-gray-50',
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <Text className="font-medium text-gray-900">
                        {review.product?.name}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="text-sm text-gray-700">
                        {review.reviewBy?.firstName} {review.reviewBy?.lastName}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <RatingStars rating={review.rating} />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <Text className="text-sm text-gray-600">
                        {isExpanded ? comment : commentPreview}
                      </Text>
                      {comment.length > 60 && (
                        <button
                          onClick={() => toggleExpanded(review._id)}
                          className="mt-1 text-xs text-primary hover:underline"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        color={getStatusBadgeColor(review.status)}
                        className="capitalize"
                      >
                        {review.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <Text className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to{' '}
            {Math.min(currentPage * limit, total)} of {total} reviews
          </Text>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
