'use client';

import { useState } from 'react';
import { Button, Input, Select } from 'rizzui';
import { PiMagnifyingGlassBold, PiXBold } from 'react-icons/pi';
import type { ReturnsFilters } from '@/hooks/queries/useReturns';

interface ReturnFiltersProps {
  currentFilters: ReturnsFilters;
  onChange: (filters: Partial<ReturnsFilters>) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'items_received', label: 'Items Received' },
  { value: 'inspecting', label: 'Inspecting' },
  { value: 'inspection_passed', label: 'Inspection Passed' },
  { value: 'inspection_failed', label: 'Inspection Failed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ReturnFilters({
  currentFilters,
  onChange,
}: ReturnFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');

  const handleSearch = () => {
    onChange({ search: searchTerm });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onChange({ search: '' });
  };

  const handleStatusChange = (value: string) => {
    onChange({ status: value || undefined });
  };

  const hasFilters = currentFilters.status || currentFilters.search;

  const handleClearAll = () => {
    setSearchTerm('');
    onChange({ status: undefined, search: '' });
  };

  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Filters</h3>
        {hasFilters && (
          <Button
            variant="text"
            onClick={handleClearAll}
            className="h-auto p-0 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 @container @lg:grid-cols-12">
        {/* Search */}
        <div className="@lg:col-span-6">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search by return number or reason..."
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              suffix={
                searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PiXBold className="h-4 w-4" />
                  </button>
                )
              }
              className="flex-grow"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="@lg:col-span-3">
          <Select
            options={STATUS_OPTIONS}
            value={currentFilters.status || ''}
            onChange={handleStatusChange}
            placeholder="Filter by status"
            getOptionValue={(option) => option.value}
            displayValue={(selected: string) =>
              STATUS_OPTIONS.find((opt) => opt.value === selected)?.label ?? 'All Statuses'
            }
          />
        </div>
      </div>
    </div>
  );
}
