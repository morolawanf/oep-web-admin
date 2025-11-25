"use client";

import { Fragment } from "react";
import cn from "@core/utils/class-names";
import { Table } from "rizzui";
import { getColumnOptions } from "./util";
import { CustomHeaderCellProps } from "./table-types";
import type { Table as TableType } from "@tanstack/react-table";

/**
 * Skeleton row that matches table structure
 * Renders placeholder cells based on header configuration
 */
function TableSkeletonRow<TData extends Record<string, any>>({
  headerGroup,
  isLeftScrollable,
  isRightScrollable,
  className,
}: CustomHeaderCellProps<TData>) {
  return (
    <Table.Row className={className}>
      {headerGroup?.headers.map((header) => {
        const { canPin, isPinned, isLeftPinned, isRightPinned } = getColumnOptions(header.column);

        return (
          <Table.Cell
            key={header.id}
            style={{
              left: isLeftPinned ? header.column.getStart("left") : undefined,
              right: isRightPinned ? header.column.getAfter("right") : undefined,
              width: header.getSize(),
            }}
            className={cn(
              isPinned && canPin && "sticky z-10",
              isPinned && isLeftScrollable && "sticky-right",
              isPinned && isRightScrollable && "sticky-left"
            )}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
          </Table.Cell>
        );
      })}
    </Table.Row>
  );
}

/**
 * TableSkeleton Component
 * 
 * Displays animated skeleton rows while data is loading.
 * Automatically matches table structure including:
 * - Column widths
 * - Pinned columns
 * - Scroll behavior
 * 
 * @example
 * ```tsx
 * import { TableSkeleton } from '@core/components/table/TableSkeleton';
 * 
 * <Table.Body>
 *   {isLoading ? (
 *     <TableSkeleton
 *       table={table}
 *       isLeftScrollable={isLeftScrollable}
 *       isRightScrollable={isRightScrollable}
 *       rowCount={10}
 *     />
 *   ) : (
 *     // ... actual table rows
 *   )}
 * </Table.Body>
 * ```
 */
export interface TableSkeletonProps<TData extends Record<string, any>> {
  /** TanStack Table instance */
  table: TableType<TData>;
  /** Whether left side is scrollable (for sticky shadows) */
  isLeftScrollable: boolean;
  /** Whether right side is scrollable (for sticky shadows) */
  isRightScrollable: boolean;
  /** Number of skeleton rows to display */
  rowCount?: number;
  /** Optional className for Table.Body */
  className?: string;
  /** Optional className for each row */
  rowClassName?: string;
}

export function TableSkeleton<TData extends Record<string, any>>({
  table,
  isLeftScrollable,
  isRightScrollable,
  rowCount = 5,
  className,
  rowClassName,
}: TableSkeletonProps<TData>) {
  const headerGroups = table.getHeaderGroups();

  return (
    <Table.Body className={className}>
      {Array.from({ length: rowCount }).map((_, index) => (
        <Fragment key={`skeleton-row-${index}`}>
          {headerGroups.map((headerGroup) => (
            <TableSkeletonRow
              key={`${headerGroup.id}-${index}`}
              headerGroup={headerGroup}
              isLeftScrollable={isLeftScrollable}
              isRightScrollable={isRightScrollable}
              className={rowClassName}
            />
          ))}
        </Fragment>
      ))}
    </Table.Body>
  );
}

export default TableSkeleton;