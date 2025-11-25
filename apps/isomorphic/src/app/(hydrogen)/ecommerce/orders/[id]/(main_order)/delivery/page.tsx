import DeliveryPageClient from './DeliveryPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const orderId = (await params).id;

  return <DeliveryPageClient orderId={orderId} />;
}
