# File Upload Implementation Guide

Complete guide for implementing the custom file upload system in your forms.

## Table of Contents
- [Quick Start](#quick-start)
- [Basic Implementation](#basic-implementation)
- [With TanStack Form](#with-tanstack-form)
- [Without TanStack Form (React Hook Form)](#without-tanstack-form-react-hook-form)
- [Advanced Usage](#advanced-usage)
- [DRY Principles](#dry-principles)

---

## Quick Start

### Installation
No additional installation needed. The components are already available in `@core/ui/file-upload`.

### Import Components
```typescript
import { UploadZone, AvatarUpload, UploadHistory } from '@core/ui/file-upload';
```

---

## Basic Implementation

### Minimal Example (Any Form Library)

```tsx
'use client';

import { useState } from 'react';
import { UploadZone } from '@core/ui/file-upload';

export default function SimpleUploadForm() {
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploaded files:', images);
    // Send to API: images contains full file data with CDN URLs
  };

  return (
    <form onSubmit={handleSubmit}>
      <UploadZone
        label="Product Images"
        name="images"
        getValues={(name) => images}
        setValue={(name, value) => setImages(value)}
        category="products"
        multiple={true}
        accept="image/*"
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key Points:**
- `getValues`: Function that returns current field value
- `setValue`: Function that updates field value
- Files are automatically uploaded when user clicks "Upload X files"
- Form value contains full file data ready for API submission

---

## With TanStack Form

### Complete Form Example

```tsx
'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { UploadZone, AvatarUpload } from '@core/ui/file-upload';
import { Button, Input } from 'rizzui';
import toast from 'react-hot-toast';

// Define validation schema
const uploadedFileSchema = z.object({
  path: z.string(),
  url: z.string(),
  size: z.number(),
  mimetype: z.string(),
  originalName: z.string(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name required'),
  avatar: uploadedFileSchema.optional(),
  images: z.array(uploadedFileSchema).min(1, 'At least one image required'),
});

export default function ProductFormTanStack() {
  const form = useForm({
    defaultValues: {
      name: '',
      avatar: undefined,
      images: [],
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      
      // Extract just URLs for API if needed
      const imageUrls = value.images.map(img => img.url);
      
      // Or send full file data
      await apiClient.post('/products', value);
      
      toast.success('Product created!');
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* Text Input */}
      <form.Field
        name="name"
        validators={{
          onChange: productSchema.shape.name,
        }}
        children={(field) => (
          <Input
            label="Product Name"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={field.state.meta.errors?.[0]}
          />
        )}
      />

      {/* Avatar Upload */}
      <form.Field
        name="avatar"
        children={(field) => (
          <AvatarUpload
            name={field.name}
            getValues={(name) => field.state.value}
            setValue={(name, value) => field.handleChange(value)}
            category="avatars"
          />
        )}
      />

      {/* Multiple Images Upload */}
      <form.Field
        name="images"
        validators={{
          onChange: productSchema.shape.images,
        }}
        children={(field) => (
          <UploadZone
            label="Product Images"
            name={field.name}
            getValues={(name) => field.state.value}
            setValue={(name, value) => field.handleChange(value)}
            error={field.state.meta.errors?.[0]}
            category="products"
            multiple={true}
            accept="image/*"
          />
        )}
      />

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit}
            isLoading={isSubmitting}
          >
            Create Product
          </Button>
        )}
      />
    </form>
  );
}
```

### Key TanStack Form Concepts

1. **Field Binding**:
   ```tsx
   <form.Field
     name="images"
     children={(field) => (
       <UploadZone
         name={field.name}
         getValues={(name) => field.state.value}
         setValue={(name, value) => field.handleChange(value)}
       />
     )}
   />
   ```

2. **Validation**:
   ```tsx
   validators={{
     onChange: z.array(uploadedFileSchema).min(1, 'Required'),
   }}
   ```

3. **Submit State**:
   ```tsx
   <form.Subscribe
     selector={(state) => [state.canSubmit, state.isSubmitting]}
     children={([canSubmit, isSubmitting]) => (
       <Button disabled={!canSubmit} isLoading={isSubmitting}>
         Submit
       </Button>
     )}
   />
   ```

---

## Without TanStack Form (React Hook Form)

### Complete Form Example

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadZone, AvatarUpload } from '@core/ui/file-upload';
import { Button, Input } from 'rizzui';
import toast from 'react-hot-toast';

// Define validation schema
const uploadedFileSchema = z.object({
  path: z.string(),
  url: z.string(),
  size: z.number(),
  mimetype: z.string(),
  originalName: z.string(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name required'),
  avatar: uploadedFileSchema.optional(),
  images: z.array(uploadedFileSchema).min(1, 'At least one image required'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductFormRHF() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      images: [],
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    console.log('Form submitted:', data);
    
    // Extract just URLs for API if needed
    const imageUrls = data.images.map(img => img.url);
    
    // Or send full file data
    await apiClient.post('/products', data);
    
    toast.success('Product created!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Text Input */}
      <Input
        label="Product Name"
        {...register('name')}
        error={errors.name?.message}
      />

      {/* Avatar Upload */}
      <AvatarUpload
        name="avatar"
        getValues={getValues}
        setValue={setValue}
        error={errors.avatar?.message}
        category="avatars"
      />

      {/* Multiple Images Upload */}
      <UploadZone
        label="Product Images"
        name="images"
        getValues={getValues}
        setValue={setValue}
        error={errors.images?.message}
        category="products"
        multiple={true}
        accept="image/*"
      />

      {/* Submit Button */}
      <Button type="submit" isLoading={isSubmitting}>
        Create Product
      </Button>
    </form>
  );
}
```

### Key React Hook Form Concepts

1. **Direct Props**:
   ```tsx
   <UploadZone
     name="images"
     getValues={getValues}  // Pass directly from useForm
     setValue={setValue}    // Pass directly from useForm
     error={errors.images?.message}
   />
   ```

2. **Type Safety**:
   ```tsx
   type ProductFormData = z.infer<typeof productSchema>;
   
   useForm<ProductFormData>({
     resolver: zodResolver(productSchema),
   });
   ```

3. **Simpler than TanStack** - no field wrappers needed!

---

## Advanced Usage

### Reusable Upload Field (DRY)

Create a reusable wrapper component:

```tsx
// components/form/FormUploadZone.tsx
'use client';

import { UploadZone } from '@core/ui/file-upload';
import { FieldApi } from '@tanstack/react-form';

interface FormUploadZoneProps {
  field: FieldApi<any, any>;
  label: string;
  category: string;
  multiple?: boolean;
  accept?: string;
}

export function FormUploadZone({
  field,
  label,
  category,
  multiple = true,
  accept = 'image/*',
}: FormUploadZoneProps) {
  return (
    <UploadZone
      label={label}
      name={field.name}
      getValues={(name) => field.state.value}
      setValue={(name, value) => field.handleChange(value)}
      error={field.state.meta.errors?.[0]}
      category={category}
      multiple={multiple}
      accept={accept}
    />
  );
}

// Usage in forms
<form.Field
  name="images"
  validators={{ onChange: productSchema.shape.images }}
  children={(field) => (
    <FormUploadZone
      field={field}
      label="Product Images"
      category="products"
      multiple={true}
    />
  )}
/>
```

### Custom Categories

Organize uploads by backend category:

```tsx
// Products
<UploadZone category="products" />

// Reviews
<UploadZone category="reviews" />

// Documents
<UploadZone category="documents" accept="application/pdf" />

// General (default)
<UploadZone category="general" />
```

Backend stores files in: `/{category}/{uuid}-{timestamp}-{hash}.{ext}`

### Extract URLs Only

If your API only needs URLs:

```tsx
const onSubmit = async (data: FormData) => {
  // Extract just the CDN URLs
  const imageUrls = data.images.map(img => img.url);
  
  await apiClient.post('/products', {
    name: data.name,
    imageUrls, // Just URLs, not full file objects
  });
};
```

### Handle History Imports

Files imported from history have `fromHistory: true` flag:

```tsx
const onSubmit = async (data: FormData) => {
  const newUploads = data.images.filter(img => !img.fromHistory);
  const existingFiles = data.images.filter(img => img.fromHistory);
  
  console.log('Newly uploaded:', newUploads);
  console.log('From history:', existingFiles);
};
```

---

## DRY Principles

### 1. Reusable Schema

```tsx
// schemas/upload.ts
import { z } from 'zod';

export const uploadedFileSchema = z.object({
  path: z.string(),
  url: z.string(),
  size: z.number(),
  mimetype: z.string(),
  originalName: z.string(),
});

export const imageArraySchema = z
  .array(uploadedFileSchema)
  .min(1, 'At least one image required');

export const optionalImageSchema = uploadedFileSchema.optional();

// Use in multiple forms
import { imageArraySchema, optionalImageSchema } from '@/schemas/upload';

const productSchema = z.object({
  images: imageArraySchema,
  thumbnail: optionalImageSchema,
});
```

### 2. Reusable Form Field Component

```tsx
// components/form/FormField.tsx
export function FormImageUpload({ 
  form, 
  name, 
  label, 
  category,
  multiple = true,
  required = false 
}) {
  return (
    <form.Field
      name={name}
      validators={required ? { 
        onChange: z.array(uploadedFileSchema).min(1, `${label} required`) 
      } : undefined}
      children={(field) => (
        <UploadZone
          label={label}
          name={field.name}
          getValues={(name) => field.state.value}
          setValue={(name, value) => field.handleChange(value)}
          error={field.state.meta.errors?.[0]}
          category={category}
          multiple={multiple}
        />
      )}
    />
  );
}

// Usage
<FormImageUpload 
  form={form}
  name="images"
  label="Product Images"
  category="products"
  required={true}
/>
```

### 3. Reusable Submit Handler

```tsx
// utils/form-helpers.ts
export function extractFileUrls(files: UploadedFile[]) {
  return files.map(file => file.url);
}

export function extractFilePaths(files: UploadedFile[]) {
  return files.map(file => file.path);
}

export function separateNewAndExisting(files: UploadedFile[]) {
  return {
    new: files.filter(f => !f.fromHistory),
    existing: files.filter(f => f.fromHistory),
  };
}

// Usage
const onSubmit = async (data: FormData) => {
  const imageUrls = extractFileUrls(data.images);
  await apiClient.post('/products', { ...data, imageUrls });
};
```

---

## Component Props Reference

### UploadZone

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Form field name |
| `getValues` | `(name: string) => any` | Required | Function to get field value |
| `setValue` | `(name: string, value: any) => void` | Required | Function to set field value |
| `label` | `string` | `undefined` | Field label |
| `error` | `string` | `undefined` | Error message |
| `category` | `string` | `"general"` | Backend category for storage |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `accept` | `string` | `"image/*"` | File type filter |
| `className` | `string` | `undefined` | Additional CSS classes |

### AvatarUpload

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Form field name |
| `getValues` | `(name: string) => any` | Required | Function to get field value |
| `setValue` | `(name: string, value: any) => void` | Required | Function to set field value |
| `error` | `string` | `undefined` | Error message |
| `category` | `string` | `"avatar"` | Backend category |
| `accept` | `string` | `"image/*"` | File type filter |
| `className` | `string` | `undefined` | Additional CSS classes |

---

## File Types

### Supported Accept Values

```tsx
// Images only
<UploadZone accept="image/*" />

// PDFs only
<UploadZone accept="application/pdf" />

// Videos only
<UploadZone accept="video/*" />

// Audio only
<UploadZone accept="audio/*" />

// All files
<UploadZone accept="*/*" />

// Multiple types
<UploadZone accept="image/*,application/pdf" />
```

---

## Troubleshooting

### Common Issues

**Issue**: Files don't appear after adding from history
- **Fix**: Ensure you're using the latest version with `forceUpdate` mechanism

**Issue**: Can't delete uploaded files
- **Fix**: Ensure you're using the latest version with proper `setValue` + `forceUpdate`

**Issue**: Images not displaying
- **Fix**: Check CDN URL configuration in `cdn-url.ts`

**Issue**: Upload fails
- **Fix**: Check authentication, file size (<10MB), and backend logs

### Best Practices

1. **Always validate file uploads**:
   ```tsx
   images: z.array(uploadedFileSchema).min(1, 'Required')
   ```

2. **Use appropriate categories**:
   ```tsx
   category="products"  // Not "general" for products
   ```

3. **Limit file types**:
   ```tsx
   accept="image/*"  // Don't use "*/*" unless necessary
   ```

4. **Handle form state properly**:
   ```tsx
   getValues={getValues}  // Pass form's getValues
   setValue={setValue}    // Pass form's setValue
   ```

---

## Quick Reference

### Minimal Setup (3 steps)

```tsx
// 1. Import
import { UploadZone } from '@core/ui/file-upload';

// 2. Add to form
<UploadZone
  name="images"
  getValues={getValues}
  setValue={setValue}
  category="products"
/>

// 3. Handle submit
const onSubmit = (data) => {
  console.log(data.images); // Full file data with CDN URLs
};
```

### TypeScript Types

```typescript
import type { UploadedFile } from '@core/ui/file-upload';

interface FormData {
  images: UploadedFile[];
  avatar?: UploadedFile;
}
```

---

## Examples Repository

Full working examples available at:
- Test page: `/test-upload` in admin dashboard
- Source: `apps/isomorphic/src/app/test-upload/test-upload-client.tsx`

---

## Summary

**Choose Based On Your Form Library:**

- **TanStack Form**: Use `form.Field` wrapper with `field.state.value` and `field.handleChange`
- **React Hook Form**: Use direct `getValues` and `setValue` props
- **No Library**: Use `useState` with custom getters/setters

**Key DRY Principles:**
1. Reuse validation schemas across forms
2. Create wrapper components for common patterns
3. Extract utility functions for file operations
4. Use consistent categories across the app

**Remember:**
- Files upload when user clicks "Upload X files"
- Form value contains full file data (path, url, size, etc.)
- History imports are marked with `fromHistory: true`
- CDN URLs are automatically constructed on display
