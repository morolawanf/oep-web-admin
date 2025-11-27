import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import SettingsForm from '@/app/shared/store-settings/settings-form';

export const metadata = {
  ...metaObject('Store Settings'),
};

const pageHeader = {
  title: 'Store Settings',
  breadcrumb: [
    {
      name: 'Store Settings',
    },
  ],
};

export default function StoreSettingsPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <SettingsForm />
    </>
  );
}
