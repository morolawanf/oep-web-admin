'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Loader, Text, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiShoppingCartBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useOrders } from '@/hooks/queries/useOrders';
import Table from '@core/components/legacy-table';

type CreateFromOrderButtonProps = {
  className?: string;
};

function OrderSelectorModal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { closeModal } = useModal();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (page !== 1) {
        setPage(1); // Reset to first page on new search
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = useOrders({
    page,
    limit: 10,
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const handleSelectOrder = (orderId: string) => {
    closeModal();
  };

  const columns = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (value: string, record: any) => (
        <Text className="font-medium">{record._id || 'N/A'}</Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'customer',
      width: 200,
      render: (user: any) => (
        <div>
          <Text className="font-medium">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-xs text-gray-500">{user?.email}</Text>
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (value: number) => (
        <Text className="font-medium">₦{value.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: string) => (
        <Text
          className={cn('font-medium capitalize', {
            'text-green-600': value === 'Completed',
            'text-blue-600': value === 'Processing',
            'text-yellow-600': value === 'Pending',
            'text-red-600': value === 'Cancelled',
          })}
        >
          {value}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSelectOrder(record.orderNumber || record._id)}
        >
          Select
        </Button>
      ),
    },
  ];

  return (
    <div className="m-auto w-full max-w-4xl p-6">
      <Title as="h3" className="mb-6">
        Select Order for Invoice
      </Title>

      <Input
        type="search"
        placeholder="Search by order ID, customer name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {isLoading || isFetching ? (
        <div className="flex items-center justify-center py-12">
          <Loader variant="spinner" size="xl" />
        </div>
      ) : (
        <Table
          data={data?.orders || []}
          columns={columns}
          variant="modern"
          rowKey={(record: any) => record.orderNumber || record._id}
          className="mb-4"
        />
      )}

      {data && data.pagination.total > 10 && (
        <div className="mt-4 flex items-center justify-between">
          <Text className="text-sm text-gray-500">
            Showing {Math.min((page - 1) * 10 + 1, data.pagination.total)} -{' '}
            {Math.min(page * 10, data.pagination.total)} of {data.pagination.total} orders
          </Text>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page * 10 >= data.pagination.total}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateFromOrderButton({
  className,
}: CreateFromOrderButtonProps) {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() =>
        openModal({
          view: <OrderSelectorModal />,
          customSize: 900,
        })
      }
      className={cn('w-full @lg:w-auto', className)}
    >
      <PiShoppingCartBold className="me-1.5 h-[17px] w-[17px]" />
      Create from Order
    </Button>
  );
}
