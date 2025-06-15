import Link from 'next/link';
import { Metadata } from 'next';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import CreateOrder from '@/app/shared/ecommerce/order/create-order';
import { orderData } from '@/app/shared/ecommerce/order/order-form/form-utils';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditOrderPage({ params }: any) {
  const id = (await params).id;
  return (
    <>
      <CreateOrder id={id} order={orderData} />
    </>
  );
}
