'use client';

import { useState } from 'react';
import { useUserById } from '@/hooks/queries/useUsers';
import { useSuspendUser, useDeleteUser, useUpdateUserRole } from '@/hooks/mutations/useUserMutations';
import { Badge, Title, Button, Avatar, Text, Loader } from 'rizzui';
import { PiArrowsClockwise, PiUserCircle, PiShoppingCart, PiStar, PiHeart } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import UserOverviewTab from './tabs/user-overview-tab';
import UserOrdersTab from './tabs/user-orders-tab';
import UserReviewsTab from './tabs/user-reviews-tab';
import UserWishlistTab from './tabs/user-wishlist-tab';
import type { UserRole } from '@/types/user';

const tabs = [
  { id: 'overview', label: 'Overview', icon: PiUserCircle },
  { id: 'orders', label: 'Orders', icon: PiShoppingCart },
  { id: 'reviews', label: 'Reviews', icon: PiStar },
  { id: 'wishlist', label: 'Wishlist', icon: PiHeart },
];

interface UserDetailsClientProps {
  userId: string;
}

export default function UserDetailsClient({ userId }: UserDetailsClientProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orderPage, setOrderPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);

  const { data, isLoading, error, refetch } = useUserById(userId, {
    orderPage,
    orderLimit: 10,
    reviewPage,
    reviewLimit: 10,
  });

  const suspendUser = useSuspendUser();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Text className="text-red-600">Failed to load user details.</Text>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const { user, orders, reviews, wishlistCount, totalOrders, totalSpent, totalReturns, totalReviewCount, averageReviewRating } = data;

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      owner: 'danger',
      manager: 'warning',
      employee: 'info',
      user: 'secondary',
    } as const;
    return colors[role] || 'secondary';
  };

  return (
    <div>
      {/* User Header */}
      <div className="mb-6 rounded-lg border border-muted bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={user.image}
              name={`${user.firstName} ${user.lastName}`}
              size="xl"
            />
            <div>
              <Title as="h2" className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </Title>
              <Text className="mt-1 text-gray-600">{user.email}</Text>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="flat"
                  color={getRoleBadgeColor(user.role)}
                  className="capitalize"
                >
                  {user.role}
                </Badge>
                {user.suspended ? (
                  <Badge color="danger">Suspended</Badge>
                ) : (
                  <Badge color="success">Active</Badge>
                )}
                {user.emailVerified ? (
                  <Badge color="info">Email Verified</Badge>
                ) : (
                  <Badge color="warning">Email Not Verified</Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="h-9"
          >
            <PiArrowsClockwise className="me-1.5 size-4" />
            Refresh
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 @lg:grid-cols-4">
          <div className="rounded-md bg-gray-50 p-4">
            <Text className="text-sm text-gray-600">Total Orders</Text>
            <Title as="h3" className="mt-1 text-2xl font-semibold">
              {totalOrders}
            </Title>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <Text className="text-sm text-gray-600">Total Spent</Text>
            <Title as="h3" className="mt-1 text-2xl font-semibold">
              ${totalSpent.toFixed(2)}
            </Title>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <Text className="text-sm text-gray-600">Reviews</Text>
            <Title as="h3" className="mt-1 text-2xl font-semibold">
              {totalReviewCount}
            </Title>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <Text className="text-sm text-gray-600">Wishlist Items</Text>
            <Title as="h3" className="mt-1 text-2xl font-semibold">
              {wishlistCount}
            </Title>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto w-full">
        <div className="-mx-4 flex items-center justify-around border-b-2 border-b-gray-200 font-medium sm:mx-0 md:justify-start md:gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === 'orders'
                ? totalOrders
                : tab.id === 'reviews'
                ? totalReviewCount
                : tab.id === 'wishlist'
                ? wishlistCount
                : 0;

            return (
              <button
                key={tab.id}
                className={cn(
                  'relative flex items-center gap-2 pb-4 font-semibold capitalize text-gray-500 focus:outline-none @4xl:pb-5 md:px-4',
                  activeTab === tab.id && 'text-gray-1000'
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="size-5" />
                <span>{tab.label}</span>
                {tab.id !== 'overview' && (
                  <Badge
                    variant="flat"
                    className="ms-2 border border-muted bg-gray-200 p-0.5 px-1.5 text-gray-800"
                  >
                    {count}
                  </Badge>
                )}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 -bottom-0.5 z-10 h-0.5 bg-gray-1000"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <UserOverviewTab
              user={user}
              totalReturns={totalReturns}
              averageRating={averageReviewRating}
              onSuspend={() => suspendUser.mutate({ userId: user._id, suspend: !user.suspended })}
              onDelete={() => deleteUser.mutate(user._id)}
              onUpdateRole={(role: UserRole) => updateRole.mutate({ userId: user._id, role })}
            />
          )}
          {activeTab === 'orders' && (
            <UserOrdersTab
              orders={orders}
              totalOrders={totalOrders}
              currentPage={orderPage}
              onPageChange={setOrderPage}
            />
          )}
          {activeTab === 'reviews' && (
            <UserReviewsTab
              reviews={reviews}
              totalReviews={totalReviewCount}
              currentPage={reviewPage}
              onPageChange={setReviewPage}
            />
          )}
          {activeTab === 'wishlist' && <UserWishlistTab userId={userId} />}
        </div>
      </div>
    </div>
  );
}
