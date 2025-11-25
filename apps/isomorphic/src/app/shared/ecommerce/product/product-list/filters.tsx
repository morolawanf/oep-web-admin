'use client';

import { FilterDrawerView } from '@core/components/controlled-table/table-filter';
import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { useState, useEffect, useMemo } from 'react';
import {
  PiFunnel,
  PiMagnifyingGlassBold,
  PiTrash,
  PiTrashDuotone,
} from 'react-icons/pi';
import { Button, Flex, Input, Select, Badge } from 'rizzui';
import { useParentCategoryOptions } from '@/hooks/queries/useParentCategoryOptions';
import { useDebounce } from '@/hooks/use-debounce';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
}

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
];

const availabilityOptions = [
  { label: 'In Stock', value: 'in-stock' },
  { label: 'Low Stock', value: 'low-stock' },
  { label: 'Out of Stock', value: 'out-of-stock' },
];

export default function Filters<TData extends Record<string, any>>({
  table,
}: TableToolbarProps<TData>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [pendingCategoryFilter, setPendingCategoryFilter] = useState<string | undefined>();
  const [pendingStatusFilter, setPendingStatusFilter] = useState<string | undefined>();
  const [pendingAvailabilityFilter, setPendingAvailabilityFilter] = useState<'in-stock' | 'out-of-stock' | 'low-stock' | undefined>();
  const [searchValue, setSearchValue] = useState(table.getState().globalFilter ?? '');
  const debouncedSearch = useDebounce(searchValue, 500);
  const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;

  const {
    options: { meta },
  } = table;

  const metaWithFilters = meta as any;

  // Apply debounced search directly to filter (no button needed)
  // Only trigger search if 2+ characters or empty (to allow clearing)
  useEffect(() => {
    if (debouncedSearch.length >= 2 || debouncedSearch.length === 0) {
      metaWithFilters?.setSearchFilter?.(debouncedSearch || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleApplyFilters = () => {
    metaWithFilters?.setCategoryFilter?.(pendingCategoryFilter);
    metaWithFilters?.setStatusFilter?.(pendingStatusFilter);
    metaWithFilters?.setAvailabilityFilter?.(pendingAvailabilityFilter);
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (metaWithFilters?.categoryFilter) count++;
    if (metaWithFilters?.statusFilter) count++;
    if (metaWithFilters?.availabilityFilter) count++;
    return count;
  }, [
    metaWithFilters?.categoryFilter,
    metaWithFilters?.statusFilter,
    metaWithFilters?.availabilityFilter,
  ]);

  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder="Search by product name or SKU..."
        value={searchValue}
        onClear={() => setSearchValue('')}
        onChange={(e) => setSearchValue(e.target.value)}
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
        className="w-full max-w-md"
      />

      <FilterDrawerView
        isOpen={openDrawer}
        drawerTitle="Product Filters"
        setOpenDrawer={setOpenDrawer}
        onApply={handleApplyFilters}
      >
        <FilterElements 
          table={table} 
          pendingCategoryFilter={pendingCategoryFilter}
          setPendingCategoryFilter={setPendingCategoryFilter}
          pendingStatusFilter={pendingStatusFilter}
          setPendingStatusFilter={setPendingStatusFilter}
          pendingAvailabilityFilter={pendingAvailabilityFilter}
          setPendingAvailabilityFilter={setPendingAvailabilityFilter}
        />
      </FilterDrawerView>

      <Flex align="center" gap="3" className="w-auto">
        {isMultipleSelected ? (
          <Button
            color="danger"
            variant="outline"
            className="h-[34px] gap-2 text-sm"
            onClick={() => {
              const metaWithDelete = meta as any;
              metaWithDelete?.handleMultipleDelete &&
                metaWithDelete.handleMultipleDelete(
                  table.getSelectedRowModel().rows.map((r) => r.original._id)
                );
            }}
          >
            <PiTrash size={18} />
            Delete {table.getSelectedRowModel().rows.length} items
          </Button>
        ) : null}

        <Button
          variant="outline"
          onClick={() => setOpenDrawer(!openDrawer)}
          className="h-9 pe-3 ps-2.5 relative"
        >
          <PiFunnel className="me-1.5 size-[18px]" strokeWidth={1.7} />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              size="sm"
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px]"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        <ToggleColumns table={table} />
      </Flex>
    </Flex>
  );
}

function FilterElements<T extends Record<string, any>>({
  table,
  pendingCategoryFilter,
  setPendingCategoryFilter,
  pendingStatusFilter,
  setPendingStatusFilter,
  pendingAvailabilityFilter,
  setPendingAvailabilityFilter,
}: TableToolbarProps<T> & {
  pendingCategoryFilter: string | undefined;
  setPendingCategoryFilter: (value: string | undefined) => void;
  pendingStatusFilter: string | undefined;
  setPendingStatusFilter: (value: string | undefined) => void;
  pendingAvailabilityFilter: 'in-stock' | 'out-of-stock' | 'low-stock' | undefined;
  setPendingAvailabilityFilter: (value: 'in-stock' | 'out-of-stock' | 'low-stock' | undefined) => void;
}) {
  const { data: categories } = useParentCategoryOptions();

  const { meta } = table.options;
  const metaWithFilters = meta as any;
  
  // Applied filters (from table meta)
  const appliedCategoryFilter = metaWithFilters?.categoryFilter;
  const appliedStatusFilter = metaWithFilters?.statusFilter;
  const appliedAvailabilityFilter = metaWithFilters?.availabilityFilter;

  const isFiltered =
    table.getState().globalFilter || appliedCategoryFilter || appliedStatusFilter || appliedAvailabilityFilter;

  return (
    <>
      <Select
        label="Category"
        placeholder="Select category"
        options={categories || []}
        value={pendingCategoryFilter}
        onChange={(value: string) => {
          setPendingCategoryFilter(value || undefined);
        }}
        getOptionValue={(option: any) => option.value}
        displayValue={(value: string) =>
          categories?.find((c: any) => c.value === value)?.label ?? ''
        }
        clearable
        onClear={() => setPendingCategoryFilter(undefined)}
      />

      <Select
        label="Status"
        placeholder="Select status"
        options={statusOptions}
        value={pendingStatusFilter}
        onChange={(value: string) => {
          setPendingStatusFilter(value || undefined);
        }}
        getOptionValue={(option: any) => option.value}
        displayValue={(value: string) =>
          statusOptions.find((s) => s.value === value)?.label ?? ''
        }
        clearable
        onClear={() => setPendingStatusFilter(undefined)}
      />

      <Select
        label="Availability"
        placeholder="Select availability"
        options={availabilityOptions}
        value={pendingAvailabilityFilter}
        onChange={(value: string) => {
          setPendingAvailabilityFilter(value as 'in-stock' | 'out-of-stock' | 'low-stock' | undefined);
        }}
        getOptionValue={(option: any) => option.value}
        displayValue={(value: string) =>
          availabilityOptions.find((a) => a.value === value)?.label ?? ''
        }
        clearable
        onClear={() => setPendingAvailabilityFilter(undefined)}
      />

      {isFiltered && (
        <Button
          size="sm"
          onClick={() => {
            setPendingCategoryFilter(undefined);
            setPendingStatusFilter(undefined);
            setPendingAvailabilityFilter(undefined);
            metaWithFilters?.clearFilters?.();
          }}
          variant="flat"
          className="h-9 bg-gray-200/70"
        >
          <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> Clear Filters
        </Button>
      )}
    </>
  );
}
