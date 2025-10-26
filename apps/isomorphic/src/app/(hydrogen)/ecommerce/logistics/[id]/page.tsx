'use client';

import { useParams, useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import {
  useLogisticsCountries,
  useLogisticsCountry,
  useDeleteCountry,
} from '@/hooks/use-logistics';
import { Loader, Text, Button, Badge } from 'rizzui';
import { PiNotePencilDuotone, PiTrashDuotone } from 'react-icons/pi';
import DeletePopover from '@core/components/delete-popover';
import cn from '@core/utils/class-names';

export default function LogisticsConfigDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const configId = params.id as string;

  const { data: countries = [] } = useLogisticsCountries();
  const country = countries.find((c) => c._id === configId);

  const {
    data: config,
    isLoading,
    error,
  } = useLogisticsCountry(country?.countryName || '', { enabled: !!country });

  const deleteCountry = useDeleteCountry(() => {
  router.push(routes.eCommerce.logistics.config);
  });

  const pageHeader = {
    title: config?.countryName || 'Loading...',
    breadcrumb: [
      {
  href: routes.eCommerce.logistics.home,
        name: 'Logistics',
      },
      {
  href: routes.eCommerce.logistics.config,
        name: 'Configuration',
      },
      {
        name: config?.countryName || 'Details',
      },
    ],
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title="Loading..." breadcrumb={pageHeader.breadcrumb} />
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader variant="spinner" size="xl" />
        </div>
      </>
    );
  }

  if (error || !config) {
    return (
      <>
        <PageHeader title="Error" breadcrumb={pageHeader.breadcrumb} />
        <div className="flex min-h-[400px] items-center justify-center">
          <Text className="text-red-500">
            {error?.message || 'Configuration not found'}
          </Text>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Button
            variant="outline"
            onClick={() => router.push(routes.eCommerce.logistics.editConfig(configId))}
          >
            <PiNotePencilDuotone className="me-1.5 h-[17px] w-[17px]" />
            Edit
          </Button>
          <DeletePopover
            title="Delete Country"
            description={`Are you sure you want to delete ${config.countryName}? This will remove all associated states, cities, and pricing data.`}
            onDelete={() => deleteCountry.mutate(configId)}
          />
        </div>
      </PageHeader>

      <div className="@container">
        <div className="grid gap-6 @4xl:grid-cols-2">
          {/* Country Info Card */}
          <div className="rounded-lg border border-muted p-6">
            <h3 className="mb-4 text-lg font-semibold">Country Information</h3>
            <div className="space-y-3">
              <div>
                <Text className="text-sm text-gray-500">Country Code</Text>
                <Text className="font-semibold">{config.countryCode}</Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Country Name</Text>
                <Text className="font-semibold">{config.countryName}</Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Total States</Text>
                <Text className="font-semibold">{config.states.length}</Text>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="rounded-lg border border-muted p-6">
            <h3 className="mb-4 text-lg font-semibold">Statistics</h3>
            <div className="space-y-3">
              <div>
                <Text className="text-sm text-gray-500">Total Cities</Text>
                <Text className="font-semibold">
                  {config.states.reduce(
                    (acc, state) => acc + (state.cities?.length || 0),
                    0
                  )}
                </Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Total LGAs</Text>
                <Text className="font-semibold">
                  {config.states.reduce(
                    (acc, state) => acc + (state.lgas?.length || 0),
                    0
                  )}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* States List */}
        <div className="mt-6 rounded-lg border border-muted p-6">
          <h3 className="mb-4 text-lg font-semibold">States & Pricing</h3>
          {config.states.length === 0 ? (
            <Text className="text-center text-gray-500">
              No states configured yet. Click Edit to add states.
            </Text>
          ) : (
            <div className="space-y-4">
              {config.states.map((state, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <Text className="font-semibold">{state.name}</Text>
                      <Text className="text-sm text-gray-500">
                        Code: {state.code}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="text-sm text-gray-500">
                        Fallback Price
                      </Text>
                      <Text className="font-semibold">
                        ₦{state.fallbackPrice?.toLocaleString() || 0}
                      </Text>
                    </div>
                  </div>

                  {/* Cities */}
                  {state.cities && state.cities.length > 0 && (
                    <div className="mb-3">
                      <Text className="mb-2 text-sm font-medium text-gray-700">
                        Cities ({state.cities.length})
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        {state.cities.map((city, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {city.name} - ₦{city.price?.toLocaleString() || 0}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LGAs */}
                  {state.lgas && state.lgas.length > 0 && (
                    <div>
                      <Text className="mb-2 text-sm font-medium text-gray-700">
                        LGAs ({state.lgas.length})
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        {state.lgas.map((lga, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {lga.name} - ₦{lga.price?.toLocaleString() || 0}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
