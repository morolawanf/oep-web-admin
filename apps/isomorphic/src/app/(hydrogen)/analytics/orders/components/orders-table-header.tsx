import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCaretUpDownBold,
} from 'react-icons/pi';

interface OrdersTableHeaderProps {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

export default function OrdersTableHeader({
  sortColumn,
  sortDirection,
  onSort,
}: OrdersTableHeaderProps) {
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <PiCaretUpDownBold className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <PiCaretUpBold className="h-4 w-4" />
    ) : (
      <PiCaretDownBold className="h-4 w-4" />
    );
  };

  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        <th className="px-4 py-3 text-left">
          <button className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900">
            Order ID
          </button>
        </th>
        <th className="px-4 py-3 text-left">
          <button className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900">
            Customer
          </button>
        </th>
        <th className="px-4 py-3 text-right">
          <button
            className="flex items-center justify-end gap-1 font-semibold text-gray-700 hover:text-gray-900"
          >
            Amount 
          </button>
        </th>
        <th className="px-4 py-3 text-left">
          <span className="font-semibold text-gray-700">Status</span>
        </th>
        <th className="px-4 py-3 text-left">
          <button

            className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
          >
            Date
          </button>
        </th>
      </tr>
    </thead>
  );
}
