# File Upload System - Custom Implementation

This document describes the custom file upload system that replaces uploadthing with axios-based uploads to the backend API.

## Overview

The file upload system now uses:
- **Backend API**: Custom file upload endpoints (`/upload/single` and `/upload/multiple`)
- **HTTP Client**: Axios with automatic authentication
- **Upload History**: LocalStorage-based history (last 20 uploads)
- **Data Format**: Standardized response format from backend

## Components

### 1. UploadZone
Multi-file or single-file upload component with drag-and-drop support.

```tsx
import { UploadZone } from '@/components/ui/file-upload';

<UploadZone
  label="Product Images"
  name="images"
  getValues={getValues}
  setValue={setValue}
  error={errors.images?.message}
  category="products"     // Backend category (e.g., 'products', 'reviews', 'general')
  multiple={true}         // Allow multiple files
  accept="image/*"        // File type filter
  className="mt-4"
/>
```

**Props:**
- `label`: Optional field label
- `name`: Form field name (required)
- `getValues`: React Hook Form getValues function (required)
- `setValue`: React Hook Form setValue function (required)
- `error`: Error message string
- `category`: Backend category for file organization (default: "general")
- `multiple`: Allow multiple file uploads (default: true)
- `accept`: File types to accept (default: "image/*")
- `className`: Additional CSS classes

**Features:**
- Drag-and-drop file selection
- Preview uploaded images
- Remove individual files
- Batch upload
- Upload history integration
- Automatic history tracking

### 2. AvatarUpload
Single avatar/profile image upload with circular preview.

```tsx
import { AvatarUpload } from '@/components/ui/file-upload';

<AvatarUpload
  name="avatar"
  getValues={getValues}
  setValue={setValue}
  error={errors.avatar?.message}
  category="avatar"       // Backend category
  accept="image/*"        // File type filter
/>
```

**Props:**
- `name`: Form field name (required)
- `getValues`: React Hook Form getValues function (required)
- `setValue`: React Hook Form setValue function (required)
- `error`: Error message string
- `category`: Backend category (default: "avatar")
- `accept`: File types to accept (default: "image/*")
- `className`: Additional CSS classes

**Features:**
- Circular avatar preview
- Single file upload
- Edit overlay on hover
- Upload history integration
- Automatic https:// URL handling

### 3. UploadHistory
Collapsible component displaying the last 20 successful uploads.

```tsx
import { UploadHistory } from '@/components/ui/file-upload';

<UploadHistory className="mt-5" />
```

**Features:**
- Displays last 20 uploads
- Collapsible pane
- Grid layout with image previews
- Copy URL to clipboard
- Remove individual items
- Clear all history
- Relative timestamps (e.g., "2h ago")
- File size display

## Data Format

### Upload Response Format
The backend returns the following format for uploaded files:

```typescript
{
  "path": "reviews/c140fb28-40bd-4ecb-b3a4-a9cccdfc04e0-1761152021863-78864231.png",
  "url": "oeptest.b-cdn.net/reviews/c140fb28-40bd-4ecb-b3a4-a9cccdfc04e0-1761152021863-78864231.png",
  "size": 337615,
  "mimetype": "image/png",
  "originalName": "iPhone-13-PRO-ropsto.fun (16).png"
}
```

For multiple uploads, an array of this format is returned.

### TypeScript Interface

```typescript
interface UploadedFile {
  path: string;
  url: string;
  size: number;
  mimetype: string;
  originalName: string;
  uploadedAt: string; // ISO timestamp (added by frontend)
}
```

## API Endpoints

### Upload Single File
```typescript
POST /upload/single
Content-Type: multipart/form-data

FormData:
- file: File
- category: string (e.g., 'products', 'reviews', 'avatar')

Response:
{
  message: "File uploaded successfully",
  data: UploadedFile
}
```

### Upload Multiple Files
```typescript
POST /upload/multiple
Content-Type: multipart/form-data

FormData:
- files: File[] (up to 10 files)
- category: string

Response:
{
  message: "Files uploaded successfully",
  data: UploadedFile[]
}
```

## Upload History

### Storage
Upload history is stored in localStorage with the key `upload_history`.

### Utilities

```typescript
import {
  getUploadHistory,
  addToUploadHistory,
  removeFromUploadHistory,
  clearUploadHistory,
  formatFileSize,
  getRelativeTime,
} from '@/utils/upload-history';

// Get all upload history
const history = getUploadHistory(); // Returns UploadedFile[]

// Add to history (automatically done by upload components)
addToUploadHistory(uploadedFile);
addToUploadHistory([file1, file2, file3]);

// Remove from history
removeFromUploadHistory('path/to/file.png');

// Clear all history
clearUploadHistory();

// Format file size
const size = formatFileSize(337615); // "329.71 KB"

// Get relative time
const time = getRelativeTime('2024-01-15T10:30:00.000Z'); // "2h ago"
```

### Limits
- Maximum 20 items stored
- Newest items first
- Automatic cleanup of oldest items

## Usage Examples

### Basic Form with File Upload

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadZone } from '@/components/ui/file-upload';
import { Button } from 'rizzui';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  images: z.array(z.object({
    url: z.string(),
    path: z.string(),
    size: z.number(),
    mimetype: z.string(),
    originalName: z.string(),
  })).min(1, 'At least one image is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    console.log('Form data:', data);
    // data.images will contain the uploaded file objects
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UploadZone
        label="Product Images"
        name="images"
        getValues={getValues}
        setValue={setValue}
        error={errors.images?.message}
        category="products"
        multiple={true}
      />
      
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  );
}
```

### Avatar Upload Example

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { AvatarUpload } from '@/components/ui/file-upload';

export default function ProfileForm() {
  const { getValues, setValue } = useForm();

  return (
    <div>
      <AvatarUpload
        name="avatar"
        getValues={getValues}
        setValue={setValue}
        category="avatar"
      />
    </div>
  );
}
```

## Migration from UploadThing

### Before (UploadThing)
```tsx
import { useUploadThing } from '@/utils/uploadthing';

const { startUpload, isUploading } = useUploadThing("generalMedia", {
  onClientUploadComplete: (res) => {
    setValue(name, res?.map(r => ({ url: r.url, name: r.name, size: r.size })));
  },
});
```

### After (Custom Upload)
```tsx
// No additional hooks needed - UploadZone handles everything
<UploadZone
  name="images"
  getValues={getValues}
  setValue={setValue}
  category="general"
  multiple={true}
/>
```

## URL Handling

All URLs from the backend come without protocol. The components automatically add `https://` when displaying images:

```typescript
// Backend returns
url: "oeptest.b-cdn.net/path/to/file.png"

// Component uses
src={url.startsWith("http") ? url : `https://${url}`}
```

## Error Handling

Errors are handled automatically and displayed using `toast` notifications:

```typescript
try {
  // Upload logic
} catch (error) {
  const errorMessage = handleApiError(error);
  toast.error(errorMessage || "Failed to upload file(s)");
}
```

## File Type Support

Supported file types:
- Images: `image/*` (jpg, png, gif, webp, etc.)
- PDFs: `application/pdf`
- CSV: `text/csv`
- Custom: Any MIME type supported by backend

Configure via the `accept` prop:
```tsx
<UploadZone accept="image/*,application/pdf" />
```

## Performance Considerations

1. **File Size Limit**: Backend enforces 10MB per file
2. **Multiple Files**: Up to 10 files per upload batch
3. **LocalStorage**: History limited to 20 items (auto-cleanup)
4. **Image Optimization**: Use Next.js Image component for previews

## Security

1. **Authentication**: All uploads require valid JWT token (automatic via axios)
2. **File Validation**: Backend validates file types and sizes
3. **Sanitization**: File names and categories are sanitized on backend
4. **CDN URLs**: Files stored on secure CDN (oeptest.b-cdn.net)

## Troubleshooting

### Upload fails with 401 error
- Check if user is authenticated
- Verify NextAuth session is active
- Check token in axios interceptor

### Images not displaying
- Verify URL format (should auto-add https://)
- Check CDN accessibility
- Inspect browser console for CORS errors

### History not saving
- Check localStorage availability
- Verify browser storage quota
- Check for localStorage errors in console

### File too large error
- Backend limit: 10MB per file
- Compress images before upload
- Use appropriate file formats
