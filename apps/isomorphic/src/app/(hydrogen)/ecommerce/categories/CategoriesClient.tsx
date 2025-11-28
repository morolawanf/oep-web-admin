'use client';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';

import CategoriesTable from '@/app/shared/ecommerce/categories/category-list/table';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';
export default function CategoriesClient({title, breadcrumb}: {title: string; breadcrumb: {href?: string; name: string}[]}) {

  return(
  
  <>
        <PageHeaderWithNavigation title={title} breadcrumb={breadcrumb} href={routes.eCommerce.createCategory} buttonText="Add Category" />
      <br />
  <CategoriesTable />
  </>
  );
}
