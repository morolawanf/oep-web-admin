/**
 * Users Analytics Client Component
 *
 * Displays comprehensive user analytics including:
 * - Overview metrics (total users, new users, active/inactive)
 * - Customer acquisition trend chart
 * - User demographics (by country/region)
 * - Top customers by spending
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { DatePicker } from '@core/ui/datepicker';
import { Text } from 'rizzui';
import {
  useUsersOverview,
  useCustomerAcquisition,
  useUserDemographics,
  useTopCustomers,
} from '@/hooks/queries/analytics';
import UsersOverviewCards from './components/users-overview-cards';
import CustomerAcquisitionChart from './components/customer-acquisition-chart';
import UserDemographicsChart from './components/user-demographics-chart';
import TopCustomersTable from './components/top-customers-table';

const pageHeader = {
  title: 'Users Analytics',
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
      name: 'Users',
    },
  ],
};

export default function UsersAnalyticsClient() {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<'days' | 'months' | 'years'>('days');

  // Table pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Format dates for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Fetch data
  const { data: overview, isLoading: loadingOverview } =
    useUsersOverview(dateParams);
  const { data: acquisition, isLoading: loadingAcquisition } =
    useCustomerAcquisition({
      ...dateParams,
      groupBy,
    });
  const { data: demographics, isLoading: loadingDemographics } =
    useUserDemographics(dateParams);
  const { data: topCustomers, isLoading: loadingCustomers } = useTopCustomers({
    ...dateParams,
    page,
    limit,
  });

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
        <UsersOverviewCards data={overview} isLoading={loadingOverview} />
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 @container lg:grid-cols-2">
        <CustomerAcquisitionChart
          data={acquisition || []}
          isLoading={loadingAcquisition}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
        />
        <UserDemographicsChart
          data={demographics || []}
          isLoading={loadingDemographics}
        />
      </div>

      {/* Top Customers Table */}
      <TopCustomersTable
        data={topCustomers}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        isLoading={loadingCustomers}
      />
    </>
  );
}
