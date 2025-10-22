'use client';

import { Title, Text } from 'rizzui';
import DateCell from '@core/ui/date-cell';
import { PiStar, PiStarFill } from 'react-icons/pi';
import type { Review } from '@/types/user';

interface UserReviewsTabProps {
  reviews: Review[];
  totalReviews: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <PiStarFill className="size-4 text-yellow-500" />
          ) : (
            <PiStar className="size-4 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
};

export default function UserReviewsTab({
  reviews,
  totalReviews,
  currentPage,
  onPageChange,
}: UserReviewsTabProps) {
  return (
    <div className="rounded-lg border border-muted bg-white p-6">
      <Title as="h3" className="mb-4 text-lg font-semibold">
        Reviews ({totalReviews})
      </Title>
      {reviews.length === 0 ? (
        <Text className="py-8 text-center text-gray-500">No reviews found</Text>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Text className="font-medium">{review.product.name}</Text>
                    <RatingStars rating={review.rating} />
                  </div>
                  <Text className="mt-2 text-gray-700">{review.comment}</Text>
                  <Text className="mt-2 text-sm text-gray-500">
                    <DateCell date={new Date(review.createdAt)} />
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
