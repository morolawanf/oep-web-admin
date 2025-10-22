'use client';

import { routes } from '@/config/routes';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import TableAvatar from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import type { UserListItem, UserRole } from '@/types/user';
import { PiCheckCircleFill, PiXCircleFill } from 'react-icons/pi';

type UsersColumnsProps = {
  onDeleteUser: (user: UserListItem) => void;
  onSuspendUser: (user: UserListItem) => void;
};

// Role badge colors
const getRoleBadgeColor = (role: UserRole) => {
  const colors = {
    owner: 'danger',
    manager: 'warning',
    employee: 'info',
    user: 'secondary',
  } as const;
  return colors[role] || 'secondary';
};

// Status badge for suspended
const StatusBadge = ({ suspended }: { suspended: boolean }) => {
  return suspended ? (
    <div className="flex items-center">
      <Badge color="danger" renderAsDot />
      <Text className="ms-2 font-medium text-red-dark">Suspended</Text>
    </div>
  ) : (
    <div className="flex items-center">
      <Badge color="success" renderAsDot />
      <Text className="ms-2 font-medium text-green-dark">Active</Text>
    </div>
  );
};

const columnHelper = createColumnHelper<UserListItem>();

export const getUsersColumns = ({ onDeleteUser, onSuspendUser }: UsersColumnsProps) => [
  columnHelper.accessor('firstName', {
    id: 'user',
    size: 300,
    header: 'User',
    enableSorting: false,
    cell: ({ row }) => (
      <TableAvatar
        src={row.original.image || ''}
        name={`${row.original.firstName} ${row.original.lastName}`}
        description={row.original.email.toLowerCase()}
      />
    ),
  }),
  columnHelper.accessor('role', {
    id: 'role',
    size: 120,
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant="flat" color={getRoleBadgeColor(row.original.role)} className="capitalize">
        {row.original.role}
      </Badge>
    ),
  }),
  columnHelper.accessor('suspended', {
    id: 'status',
    size: 140,
    header: 'Status',
    cell: ({ row }) => <StatusBadge suspended={row.original.suspended} />,
  }),
  columnHelper.accessor('orderCount', {
    id: 'orderCount',
    size: 100,
    header: 'Orders',
    cell: ({ row }) => <Text className="text-center">{row.original.orderCount}</Text>,
  }),
  columnHelper.accessor('totalSpent', {
    id: 'totalSpent',
    size: 140,
    header: 'Total Spent',
    cell: ({ row }) => (
      <Text className="font-medium">${row.original.totalSpent.toFixed(2)}</Text>
    ),
  }),
  columnHelper.accessor('emailVerified', {
    id: 'emailVerified',
    size: 120,
    header: 'Verified',
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.emailVerified ? (
          <Tooltip content="Email Verified" placement="top">
            <PiCheckCircleFill className="h-5 w-5 text-green" />
          </Tooltip>
        ) : (
          <Tooltip content="Email Not Verified" placement="top">
            <PiXCircleFill className="h-5 w-5 text-red" />
          </Tooltip>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('joinedAt', {
    id: 'joinedAt',
    size: 160,
    header: 'Joined',
    cell: ({ row }) => <DateCell date={new Date(row.original.joinedAt)} />,
  }),
  columnHelper.display({
    id: 'suspendAction',
    size: 100,
    header: 'Suspend',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Tooltip
          content={row.original.suspended ? 'Unsuspend User' : 'Suspend User'}
          placement="top"
        >
          <ActionIcon
            size="sm"
            variant="outline"
            onClick={() => onSuspendUser(row.original)}
            className={row.original.suspended ? 'hover:text-green' : 'hover:text-orange'}
          >
            {row.original.suspended ? (
              <PiCheckCircleFill className="h-4 w-4" />
            ) : (
              <PiXCircleFill className="h-4 w-4" />
            )}
          </ActionIcon>
        </Tooltip>
      </div>
    ),
  }),
  columnHelper.display({
    id: 'action',
    size: 140,
    header: 'Actions',
    cell: ({ row }) => (
      <TableRowActionGroup
      
        viewUrl={routes.users.details(row.original._id)}
        deletePopoverTitle="Delete User"
        deletePopoverDescription={`Are you sure you want to delete ${row.original.firstName} ${row.original.lastName}? This action cannot be undone.`}
        onDelete={() => onDeleteUser(row.original)}
      />
    ),
  }),
];
