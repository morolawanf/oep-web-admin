'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReturns, type ReturnsFilters } from '@/hooks/queries/useReturns';
import { routes } from '@/config/routes';
import ReturnStatisticsCards from '@/app/shared/returns/return-statistics-cards';
import ReturnFilters from '@/app/shared/returns/return-filters';
import ReturnsTable from '@/app/shared/returns/returns-table';

export default function ReturnsClient() {
  const router = useRouter();

  // Filters state
  const [filters, setFilters] = useState<ReturnsFilters>({
    page: 1,
    limit: 10,
  });

  // Fetch returns with filters and pagination
  const {
    data: returnsData,
    isLoading,
    error,
  } = useReturns(filters);

  const returns = returnsData?.data || [];
  const meta = returnsData?.meta;

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ReturnsFilters>) => {
    setFilters((prev: ReturnsFilters) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev: ReturnsFilters) => ({ ...prev, page }));
  };

  // Handle view details
  const handleViewReturn = (returnId: string) => {
    router.push(routes.eCommerce.returnDetails(returnId));
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <ReturnStatisticsCards />

      {/* Filters */}
      <ReturnFilters
        currentFilters={filters}
        onChange={handleFilterChange}
      />

      {/* Table */}
      <ReturnsTable
        returns={returns}
        meta={meta}
        onViewReturn={handleViewReturn}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
