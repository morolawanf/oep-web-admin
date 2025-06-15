import InvoiceDetails from '@/app/shared/logistics/shipment/details/invoice-details';
import DeliveryDetails from '@/app/shared/logistics/shipment/details/delivery-details';
import TrackingHistory from '@/app/shared/logistics/shipment/details/tracking-history';

export default function Page() {
  return (
    <>
      <div className="mt-2 flex flex-col gap-y-6 @container sm:gap-y-10">
        <InvoiceDetails />
        <DeliveryDetails />
        <TrackingHistory />
      </div>
    </>
  );
}
