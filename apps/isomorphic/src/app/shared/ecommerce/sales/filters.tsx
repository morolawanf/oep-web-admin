'use client';

import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Flex, Input, Select, SelectOption } from 'rizzui';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
}

export default function Filters<TData extends Record<string, any>>({
  table,
}: TableToolbarProps<TData>) {
  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder="Search by title or type..."
        value={table.getState().globalFilter ?? ''}
        onClear={() => table.setGlobalFilter('')}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      />

      <Select
        placeholder="Filter by Type"
        options={[
          { value: 'Flash', label: 'Flash' },
          { value: 'Limited', label: 'Limited' },
          { value: 'Normal', label: 'Normal' },
        ]}
        onChange={(option: SelectOption) =>
          table.setColumnFilters([{ id: 'type', value: option?.value }])
        }
      />

      <ToggleColumns table={table} />
    </Flex>
  );
}
