'use client';

import Link from 'next/link';
import Image from 'next/image';
import WidgetCard from '@core/components/cards/widget-card';
import { Text } from 'rizzui';
import { formatNumber } from '@core/utils/format-number';
import cn from '@core/utils/class-names';
import { PiStar, PiStarFill, PiHeart, PiPackage } from 'react-icons/pi';
import type {
  MostWishlistedProductRow,
  MostReviewedProductRow,
} from '@/types/analytics.types';
import { routes } from '@/config/routes';

interface WishlistedReviewedProductsProps {
  // backend rows: MostWishlistedProductRow[] and MostReviewedProductRow[]
  wishlistedData: MostWishlistedProductRow[];
  reviewedData: MostReviewedProductRow[];
  loadingWishlisted?: boolean;
  loadingReviewed?: boolean;
}

const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= Math.floor(rating) ? (
        <PiStarFill key={i} className="h-3.5 w-3.5 text-yellow-500" />
      ) : (
        <PiStar key={i} className="h-3.5 w-3.5 text-gray-300" />
      )
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

export default function WishlistedReviewedProducts({
  wishlistedData = [],
  reviewedData = [],
  loadingWishlisted,
  loadingReviewed,
}: WishlistedReviewedProductsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 @container lg:grid-cols-2">
      {/* Most Wishlisted */}
      <WidgetCard title="Most Wishlisted Products">
        {loadingWishlisted ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
          </div>
        ) : !wishlistedData || wishlistedData.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Text className="text-gray-500">No data available</Text>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {wishlistedData.map((product, index) => {
              const productName = product.productName || 'Unknown Product';
              return (
                <Link
                  key={`${product.productId}-${index}`}
                  href={routes.eCommerce.productDetails(product.productId)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-gray-50',
                    index !== wishlistedData.length - 1 &&
                      'border-b border-gray-100'
                  )}
                >
                  {/* Product Image */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {product.coverImage ? (
                      <Image
                        src={product.coverImage}
                        alt={productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <PiPackage className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Text className="block truncate font-medium text-gray-900">
                      {productName}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      ID: {product.productId.toString().slice(-8)}
                    </Text>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 text-pink-600">
                    <PiHeart className="h-5 w-5" />
                    <Text className="font-semibold">
                      {formatNumber(product.wishlistCount)}
                    </Text>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </WidgetCard>

      {/* Most Reviewed */}
      <WidgetCard title="Most Reviewed Products">
        {loadingReviewed ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
          </div>
        ) : !reviewedData || reviewedData.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Text className="text-gray-500">No data available</Text>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {reviewedData.map((product, index) => {
              const productName = product.productName || 'Unknown Product';
              return (
                <Link
                  key={`${product.productId}-${index}`}
                  href={routes.eCommerce.productDetails(product.productId)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-gray-50',
                    index !== reviewedData.length - 1 &&
                      'border-b border-gray-100'
                  )}
                >
                  {/* Product Image */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {product.coverImage ? (
                      <Image
                        src={product.coverImage}
                        alt={productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <PiPackage className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Text className="block truncate font-medium text-gray-900">
                      {productName}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      ID: {product.productId.toString().slice(-8)}
                    </Text>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <RatingStars rating={product.averageRating} />
                    <Text className="text-sm font-semibold text-gray-700">
                      ({formatNumber(product.reviewCount)})
                    </Text>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </WidgetCard>
    </div>
  );
}
