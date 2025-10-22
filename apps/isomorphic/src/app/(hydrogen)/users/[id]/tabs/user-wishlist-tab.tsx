'use client';

import { Title, Text } from 'rizzui';

interface UserWishlistTabProps {
  userId: string;
}

export default function UserWishlistTab({ userId }: UserWishlistTabProps) {
  return (
    <div className="rounded-lg border border-muted bg-white p-6">
      <Title as="h3" className="mb-4 text-lg font-semibold">
        Wishlist
      </Title>
      <Text className="py-8 text-center text-gray-500">
        Wishlist details will be implemented based on backend API support
      </Text>
    </div>
  );
}
