'use client';

import { useMemo, useState } from 'react';
import { Badge, Box, Button, Flex, Input, Text, Title } from 'rizzui';
import StatusField from '@core/components/controlled-table/status-field';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { PiMagnifyingGlassBold, PiTrashDuotone } from 'react-icons/pi';
import ModalButton from '@/app/shared/modal-button';
import CreateUser from '../create-user';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  onSearch?: (search: string) => void;
  onRoleChange?: (role: 'employee' | 'owner' | undefined) => void;
}

export default function Filters<TData extends Record<string, any>>({
  table,
  onSearch,
  onRoleChange,
}: TableToolbarProps<TData>) {
  const [selectedRole, setSelectedRole] = useState<
    'employee' | 'owner' | undefined
  >(undefined);

  const staffRoles = useMemo(
    () => [
      { label: 'All Roles', value: '' },
      { label: 'Employee', value: 'employee' },
      { label: 'Owner', value: 'owner' },
    ],
    []
  );

  const isFiltered =
    table.getState().globalFilter || selectedRole !== undefined;

  const handleSearchChange = (value: string) => {
    table.setGlobalFilter(value);
    onSearch?.(value);
  };

  const handleRoleChange = (value: string) => {
    const roleValue =
      value === '' ? undefined : (value as 'employee' | 'owner');
    setSelectedRole(roleValue);
    onRoleChange?.(roleValue);
  };

  const handleClearFilters = () => {
    table.resetGlobalFilter();
    table.resetColumnFilters();
    setSelectedRole(undefined);
    onSearch?.('');
    onRoleChange?.(undefined);
  };

  return (
    <Box className="mb-4 @container">
      <Flex
        gap="3"
        align="center"
        justify="between"
        className="w-full flex-wrap @4xl:flex-nowrap"
      >
        <Title
          as="h3"
          className="rizzui-title-h3 order-1 whitespace-nowrap pe-4 text-base font-semibold sm:text-lg"
        >
          All Users
        </Title>
        <Flex
          align="center"
          direction="col"
          gap="2"
          className="order-4 @lg:grid @lg:grid-cols-2 @4xl:order-2 @4xl:flex @4xl:flex-row"
        >
          <StatusField
            placeholder="Filter by Role"
            options={staffRoles}
            value={selectedRole || ''}
            onChange={handleRoleChange}
            getOptionValue={(option) => option.value}
            dropdownClassName="!z-10"
            className="@4xl:w-40"
          />
          {isFiltered && (
            <Button
              size="sm"
              onClick={handleClearFilters}
              variant="flat"
              className="h-9 w-full bg-gray-200/70 @lg:col-span-full @4xl:w-auto"
            >
              <PiTrashDuotone className="me-1.5 size-[17px]" /> Clear
            </Button>
          )}
        </Flex>
        <Input
          type="search"
          clearable={true}
          placeholder="Search for users..."
          value={table.getState().globalFilter ?? ''}
          onClear={() => handleSearchChange('')}
          onChange={(e) => handleSearchChange(e.target.value)}
          prefix={<PiMagnifyingGlassBold className="size-4" />}
          className="order-3 h-9 w-full @2xl:order-2 @2xl:ms-auto @2xl:h-auto @2xl:max-w-60 @4xl:order-3"
        />
        <Box className="order-2 ms-4 @2xl:order-3 @2xl:ms-0 @4xl:order-4 @4xl:shrink-0">
          <ModalButton
            label="Add New User"
            view={<CreateUser />}
            customSize={600}
            className="mt-0"
          />
        </Box>
      </Flex>
    </Box>
  );
}
