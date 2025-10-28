import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import { Button } from 'rizzui';
import TransactionDetailsClient from './transaction-details-client';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export default async function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const transactionId = (await params).transactionId;

  const pageHeader = {
    title: `Transaction Details`,
    breadcrumb: [
      {
        href: routes.transactions.list,
        name: 'Transactions',
      },
      {
        name: transactionId,
      },
    ],
  };

  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}
          href={routes.transactions.list}
          buttonText='Back to Transactions'
      />
      <TransactionDetailsClient transactionId={transactionId} />
    </>
  );
}
