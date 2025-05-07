'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { Controller } from 'react-hook-form';
import { Button, Input, Select, Switch, Text, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  bannerFormSchema,
  BannerFormInput,
} from '@/validators/create-banner.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';
import { PiTrashBold } from 'react-icons/pi';
import HorizontalFormBlockWrapper from '@/app/shared/HorizontalFormBlockWrapper';
import { BannerImageBlock } from './BannerInfoBlock';
const categoryOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
];

const defaultValues: BannerFormInput = {
  name: '',
  imageUrl: '',
  pageLink: '',
  active: false,
  category: 'A',
  createdAt: new Date(),
  _id: '',
};

export default function CreateBanner({
  id,
  banner,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  banner?: BannerFormInput;
}) {
  const [isLoading, setLoading] = useState(false);
  const [reset, setReset] = useState({});

  const onSubmit = (data: BannerFormInput) => {
    // Prevent submission if imageUrl is empty
    console.log(data);

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
    <Form<BannerFormInput>
      resetValues={reset}
      validationSchema={bannerFormSchema}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: banner || defaultValues,
      }}
      className="isomorphic-form flex flex-col gap-6"
    >
      {({
        register,
        control,
        formState: { errors },
        getValues,
        setValue,
        watch,
      }) => {
        const imageUrl = watch('imageUrl');

        return (
          <>
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
                  subClassName="grid-cols-1"
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
                <BannerImageBlock
                  error={errors?.imageUrl?.message}
                  imageUrl={imageUrl}
                  setValue={setValue}
                  getValues={getValues}
                />
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
                disabled={Object.keys(errors).length > 0}
              >
                {id ? 'Update' : 'Create'} Banner
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
