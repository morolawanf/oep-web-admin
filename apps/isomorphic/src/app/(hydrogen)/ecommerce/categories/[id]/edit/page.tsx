import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CategoryEditClient from './CategoryEditClient';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import { Metadata } from 'next';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  return metaObject(`Edit Category ${id}`);
}

export default async function EditCategoryPage({ params }: Props) {
  const id = (await params).id;

  const pageHeader = {
    title: 'Edit Category',
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
        href: routes.eCommerce.categoryDetails(id),
        name: id,
      },
      {
        name: 'Edit',
      },
    ],
  };

  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.categories} buttonText="Cancel" />
      <CategoryEditClient categoryId={id} />
    </>
  );
}
