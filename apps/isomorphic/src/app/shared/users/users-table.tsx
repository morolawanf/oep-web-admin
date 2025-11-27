'use client';

import { useEffect, useMemo, useState } from 'react';
import { getUsersColumns } from './users-columns';
import { useUsers } from '@/hooks/queries/useUsers';
import {
  useSuspendUser,
  useDeleteUser,
} from '@/hooks/mutations/useUserMutations';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import UsersFilters from './users-filters';
import type {
  UserListItem,
  UserFilters as UserFiltersType,
} from '@/types/user';
import { Loader, Text, Button } from 'rizzui';

export default function UsersTable() {
  const [filters, setFilters] = useState<UserFiltersType>({
    page: 1,
    limit: 10,
    search: '',
    sort: '-1',
  });

  const { data: usersFullData, isLoading, error, refetch } = useUsers(filters);
  const suspendUser = useSuspendUser();
  const deleteUser = useDeleteUser();

  const user = useMemo(() => usersFullData?.data || [], [usersFullData]);
  const handleSuspendUser = (user: UserListItem) => {
    suspendUser.mutate({
      userId: user._id,
      suspend: !user.suspended,
    });
  };

  const handleDeleteUser = (user: UserListItem) => {
    deleteUser.mutate(user._id);
  };

  const { table, setData } = useTanStackTable<UserListItem>({
    tableData: user,
    columnConfig: getUsersColumns({
      onSuspendUser: handleSuspendUser,
      onDeleteUser: handleDeleteUser,
    }),
    options: {
      initialState: {
        pagination: {
          pageIndex: filters.page ? filters.page - 1 : 0,
          pageSize: filters.limit || 10,
        },
      },
      meta: {
        handleDeleteRow: handleDeleteUser,
      },
      enableColumnResizing: false,
      manualPagination: true,
      pageCount: usersFullData?.meta?.pages, 
    },
  });
  useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user, setData]);
  // Handle pagination changes via table state
  useEffect(() => {
    const state = table.getState();
    const newPage = state.pagination.pageIndex + 1;
    if (usersFullData?.meta && newPage !== usersFullData?.meta.page) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  }, [table.getState().pagination.pageIndex, usersFullData?.meta]);


  const handleFilterChange = (newFilters: Partial<UserFiltersType>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div>
      <UsersFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={refetch}
        table={table}
      />

      {isLoading ? (
        <div className="flex h-96 items-center justify-center rounded-md border border-muted">
          <Loader size="xl" />
        </div>
      ) : error ? (
        <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-md border border-muted">
          <Text className="text-red-600">
            Failed to load users. Please try again.
          </Text>
          <Button onClick={() => refetch()} variant="outline" className="h-9">
            Retry
          </Button>
        </div>
      ) : (
        <>
          <Table
            table={table}
            variant="modern"
            classNames={{
              container: 'border border-muted rounded-md',
              rowClassName: 'last:border-0',
            }}
          />
          <TablePagination table={table} className="py-4" />
        </>
      )}
    </div>
  );
}
