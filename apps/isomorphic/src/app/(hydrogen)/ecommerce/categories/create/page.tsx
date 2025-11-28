import CreateCategory from '@/app/shared/ecommerce/categories/create-category';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export const metadata = {
  ...metaObject('Create a Category'),
};

const pageHeader = {
  title: 'Create A Category',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.categories,
      name: 'Categories',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateCategoryPage() {
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.categories} buttonText="Cancel" />
      <br />
      <CreateCategory />
    </>
  );
}
