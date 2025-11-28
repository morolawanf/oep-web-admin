

'use client';

import {
  Control,
  ControllerRenderProps,
  FieldErrors,
  UseFormRegister,
  useWatch,
  useController,
  Controller,
} from 'react-hook-form';
import { useState } from 'react';
import { Input, Select, Textarea,Text } from 'rizzui';
import { FormLabelWithTooltip } from '@core/ui/form-label-with-tooltip';
import { CreateCampaignInput } from '@/validators/create-campaign.schema';
import { useCheckCampaignSlug } from '@/hooks/queries/useCheckCampaignSlug';
import slugify from 'slugify';
import { useDebounce } from '@/hooks/use-debounce';
import { PiCheckCircle, PiWarningCircle } from 'react-icons/pi';
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface CampaignInfoFormProps {
  register: UseFormRegister<CreateCampaignInput>;
  control: Control<CreateCampaignInput>;
  errors: FieldErrors<CreateCampaignInput>;
  excludeId?: string;
}

export default function CampaignInfoForm({
  register,
  control,
  errors,
  excludeId,
}: CampaignInfoFormProps) {
  // Track if user manually changed slug
  const [slugTouched, setSlugTouched] = useState(false);

  // Get slug field controller so we can programmatically update it from title onChange (no refs needed)
  const { field: slugField } = useController({ name: 'slug', control });

  // Watch current slug value and debounce it for availability checks (like SKU input does)
  const watchedSlug = useWatch({ control, name: 'slug' });
  const debouncedSlug = useDebounce(watchedSlug || '', 500);
  const { data: availability, isLoading: slugCheckLoading, isError: slugCheckError } =
    useCheckCampaignSlug(debouncedSlug, excludeId);



  // Slug live check - observe current slug value via a Controller
  return (
    <div className="space-y-5">
            {/* Title */}
      <Input
        label={
          <FormLabelWithTooltip
            label="Campaign Title"
            tooltip="Enter a descriptive title for your campaign. This will be visible to customers."
            required
          />
        }
        placeholder="e.g., Summer Sale 2025"
        {...register('title', {
          onChange: (e) => {
            if (!slugTouched) {
              const value = e.target.value as string;
              const nextSlug = slugify(value, { lower: true});
              slugField.onChange(nextSlug);
            }
          },
        })}
        error={errors.title?.message}
      />
      {/* Slug */}
      <div>
        <Input
          label={
            <FormLabelWithTooltip
              label="Slug"
              tooltip="Lowercase unique identifier shown in URLs. Only lowercase letters, numbers, and hyphens."
              required
            />
          }
          placeholder="e.g., summer-sale-2025"
          value={slugField.value || ''}
          onChange={(e) => {
            setSlugTouched(true);
            slugField.onChange(e.target.value);
          }}
          error={(() => {
            if (errors.slug?.message) return errors.slug.message as string;
            if (slugCheckError && debouncedSlug) return 'Failed to verify slug availability. Please try again.';
            if (!slugCheckLoading && debouncedSlug && availability && !availability.available)
              return 'Slug is already in use';
            return undefined;
          })()}
          suffix={
            slugCheckLoading && debouncedSlug ? (
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 animate-spin text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : slugCheckError && debouncedSlug ? (
              <PiWarningCircle className="h-5 w-5 text-orange-500" title="Error checking slug" />
            ) : debouncedSlug && !slugCheckLoading ? (
              availability && !availability.available ? (
                <PiWarningCircle className="h-5 w-5 text-red-500" title="Slug already in use" />
              ) : (
                <PiCheckCircle className="h-5 w-5 text-green-500" title="Slug available" />
              )
            ) : null
          }
        />
      </div>


      {/* Description */}
      <Textarea
        label={
          <FormLabelWithTooltip
            label="Description"
            tooltip="Provide additional details about the campaign. This helps customers understand the promotion."
          />
        }
        placeholder="Enter campaign description..."
        {...register('description')}
        error={errors.description?.message}
        rows={4}
      />

      {/* Status */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            label={
              <FormLabelWithTooltip
                label="Status"
                tooltip="Draft: Not visible to customers. Active: Campaign is live. Inactive: Campaign is paused."
              />
            }
            options={statusOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.status?.message as string}
            getOptionValue={(option) => option.value}
          />
        )}
      />
    </div>
  );
}
