'use client';
import { BannerFormInput } from '@/validators/create-banner.schema';
import { useState, useEffect } from 'react';
import HorizontalFormBlockWrapper from '@/app/shared/HorizontalFormBlockWrapper';
import UploadZone from '@core/ui/file-upload/upload-zone';
import { PiTrashBold } from 'react-icons/pi';
import { Text } from 'rizzui';

type BannerImageBlockProps = {
  imageUrl: string;
  setValue: (name: keyof BannerFormInput, value: string) => void;
  getValues: (name: string) => any;
  error?: string | undefined;
};

export const BannerImageBlock: React.FC<BannerImageBlockProps> = ({
  imageUrl,
  error,
  setValue,
  getValues,
}) => {
  const [localImageUrl, setLocalImageUrl] = useState(imageUrl || '');

  // Sync local state when form value changes
  useEffect(() => {
    if (imageUrl !== undefined) {
      setLocalImageUrl(imageUrl);
    }
  }, [imageUrl]);

  // Sync form value when local state changes
  useEffect(() => {
    if (localImageUrl !== imageUrl) {
      setValue('imageUrl', localImageUrl);
    }
  }, [localImageUrl, imageUrl, setValue]);

  return (
    <HorizontalFormBlockWrapper
      title="Banner Image"
      description="Your banner image here"
      isModalView={true}
    >
      {localImageUrl ? (
        <div className="col-span-full">
          <div className="relative">
            <figure className="group relative h-40 w-full max-w-sm rounded-md bg-gray-50">
              <img
                src={localImageUrl}
                alt="Banner preview"
                className="h-full w-full rounded-md object-contain"
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-gray-700/70 p-1.5 transition duration-300 hover:bg-red-500"
                onClick={() => setLocalImageUrl('')}
              >
                <PiTrashBold className="text-white" />
              </button>
            </figure>
          </div>
        </div>
      ) : (
        <UploadZone
          label="Upload Banner Image"
          name="imageUrl"
          getValues={getValues}
          setValue={(
            name:
              | 'name'
              | 'imageUrl'
              | 'pageLink'
              | 'active'
              | 'category'
              | '_id'
              | 'createdAt',
            value: string
          ) => {
            setValue(name as keyof BannerFormInput, value);
            if (name === 'imageUrl') {
              setLocalImageUrl(value);
            }
          }}
          className="col-span-full"
        />
      )}

      {error ? <Text className="text-md text-red-600">{error}</Text> : null}
    </HorizontalFormBlockWrapper>
  );
};
