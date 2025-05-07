'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import SelectLoader from '@core/components/loader/select-loader';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Select, Switch, Text, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  CategoryFormInput,
  categoryFormSchema,
} from '@/validators/create-category.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';

// const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
//   ssr: false,
//   loading: () => <SelectLoader />,
// });

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// Parent category option
const parentCategoryOption = [
  {
    value: 'fruits',
    label: 'Fruits',
  },
  {
    value: 'grocery',
    label: 'Grocery',
  },
  {
    value: 'meat',
    label: 'Meat',
  },
  {
    value: 'cat food',
    label: 'Cat Food',
  },
];

// Type option
const typeOption = [
  {
    value: 'fresh vegetables',
    label: 'Fresh Vegetables',
  },
  {
    value: 'diet foods',
    label: 'Diet Foods',
  },
  {
    value: 'green vegetables',
    label: 'Green Vegetables',
  },
];

// a reusable form wrapper component
function HorizontalFormBlockWrapper({
  title,
  description,
  children,
  className,
  isModalView = true,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
  isModalView?: boolean;
}>) {
  return (
    <div
      className={cn(
        className,
        isModalView ? '@5xl:grid @5xl:grid-cols-6' : ' '
      )}
    >
      {isModalView && (
        <div className="col-span-2 mb-6 pe-4 @5xl:mb-0">
          <Title as="h6" className="font-semibold">
            {title}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{description}</Text>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5',
          isModalView ? 'col-span-4' : ' '
        )}
      >
        {children}
      </div>
    </div>
  );
}

import { BannerType } from './banner-types';

const categoryOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
];

export default function CreateBanner({
  id,
  banner,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  banner?: BannerType;
}) {
  const [isLoading, setLoading] = useState(false);
  const [reset, setReset] = useState({});

  const onSubmit = (data: BannerType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Here you would send data to your API
      console.log(id ? 'updateBanner data ->' : 'createBanner data ->', data);
      if (!id) {
        setReset({
          name: '',
          imageUrl: '',
          pageLink: '',
          active: false,
          category: 'A',
          createdAt: new Date(),
          _id: '',
        });
      }
    }, 600);
  };

  return (
    <Form<BannerType>
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: banner || {
          name: '',
          imageUrl: '',
          pageLink: '',
          active: false,
          category: 'A',
          createdAt: new Date(),
          _id: '',
        },
      }}
      className="isomorphic-form flex flex-col gap-6"
    >
      {({ register, control, formState: { errors }, getValues, setValue }) => (
        <>
          {/* <Title as="h6" className="mb-2 font-semibold">
            {id ? 'Update Banner' : 'Create Banner'}
          </Title> */}

          <div className="flex-grow pb-1">
            <div
              className={cn(
                'grid grid-cols-1',
                isModalView
                  ? 'grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11'
                  : 'gap-5'
              )}
            >
              <HorizontalFormBlockWrapper
                title={'Banner Information'}
                description={'Edit your banner information from here'}
                isModalView={isModalView}
              >
                <Input
                  label="Banner Name"
                  placeholder="banner name"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Page Link"
                  placeholder="/page-link"
                  {...register('pageLink')}
                  error={errors.pageLink?.message}
                />
                <Controller
                  name="category"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-0"
                      options={categoryOptions}
                      value={value}
                      onChange={onChange}
                      label="Category"
                      error={errors?.category?.message as string}
                      getOptionValue={(option) => option.label}
                    />
                  )}
                />
                {id ? (
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-1 items-center gap-2">
                        <label className="block font-medium">
                          Active State
                        </label>
                        <Switch
                          checked={field.value}
                          onChange={(checked) => {
                            field.onChange(checked);
                          }}
                        />
                      </div>
                    )}
                  />
                ) : null}
              </HorizontalFormBlockWrapper>
              <HorizontalFormBlockWrapper
                title="Upload Banner Image"
                description="Upload your banner image here"
                isModalView={isModalView}
              >
                <UploadZone
                  label="Upload Banner Image"
                  name="imageUrl"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
                />
              </HorizontalFormBlockWrapper>
            </div>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
              isModalView ? '-mx-10 -mb-7 px-10 py-1' : 'py-1'
            )}
          >
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {id ? 'Update' : 'Create'} Banner
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
