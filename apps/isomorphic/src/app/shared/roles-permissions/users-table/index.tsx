'use client';

import { useState, useEffect } from 'react';
import {
  useStaff,
  useDeleteUser,
  type StaffUser,
} from '@/hooks/use-role-management';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { usersColumns } from './columns';
import Table from '@core/components/table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { Text, Button, Loader } from 'rizzui';
import { PiArrowsClockwise } from 'react-icons/pi';

export type UsersTableDataType = StaffUser & {
  id: number;
  fullName: string;
  avatar: string;
  createdAt: string;
};

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'employee' | 'owner' | undefined>(undefined);
  const {
    data: staffData,
    isLoading,
    error,
    refetch,
  } = useStaff({ page, limit: 10, search, role });
  const deleteUserMutation = useDeleteUser();

  // Transform staff data to table format
  const tableData: UsersTableDataType[] =
    staffData?.users?.map((user, index) => ({
      ...user,
      id: index + 1,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.image || '/avatar-placeholder.png',
      createdAt: user.joinedAt,
    })) || [];

  const { table, setData } = useTanStackTable<UsersTableDataType>({
    tableData: [], // Start with empty array
    columnConfig: usersColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row) => {
          try {
            await deleteUserMutation.mutateAsync(row._id);
            setData((prev) => prev.filter((r) => r._id !== row._id));
            table.resetRowSelection();
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        },
        handleMultipleDelete: async (rows) => {
          try {
            await Promise.all(
              rows.map((row: UsersTableDataType) =>
                deleteUserMutation.mutateAsync(row._id)
              )
            );
            setData((prev) =>
              prev.filter(
                (r) =>
                  !rows.some((row: UsersTableDataType) => row._id === r._id)
              )
            );
            table.resetRowSelection();
          } catch (error) {
            console.error('Error deleting users:', error);
          }
        },
      },
      enableColumnResizing: false,
    },
  });

  // Update table data when staffData changes
  useEffect(() => {
    if (tableData.length > 0) {
      setData(tableData);
    }
  }, [staffData, setData]);

  return (
    <div className="mt-14">
      <Filters table={table} onSearch={setSearch} onRoleChange={setRole} />
      <div className="rounded-md border border-muted">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader variant="spinner" size="xl" />
            <Text className="mt-4 text-gray-600">Loading staff members...</Text>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Text className="mb-2 text-lg font-semibold text-red-500">
              Error loading staff members
            </Text>
            <Text className="mb-4 text-gray-600">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </Text>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-2"
            >
              <PiArrowsClockwise className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
          <Table
            table={table}
            variant="modern"
            classNames={{
              rowClassName: 'last:border-0',
            }}
          />
        )}
      </div>
      {!isLoading && !error && (
        <>
          <TableFooter table={table} />
          <TablePagination table={table} className="py-4" />
        </>
      )}
    </div>
  );
}
