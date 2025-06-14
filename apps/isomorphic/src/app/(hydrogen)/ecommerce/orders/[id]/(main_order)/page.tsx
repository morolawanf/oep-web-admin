import OrderView from '@/app/shared/ecommerce/order/order-view';

export default async function OrderDetailsPage({ params }: any) {
  const id = (await params).id;

  return (
    <>
      <OrderView />
    </>
  );
}
