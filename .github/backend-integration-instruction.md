# Backend API Integration - Quick Reference

**Goal**: Fast API integration by mapping routes from `server.ts` to their implementation details.

## The Journey Map

### Step 1: Find Your Route in `server.ts`
```typescript
// Example: Looking for product endpoints
app.use('/products', ProductsRoute);  // → src/routes/general/products.ts
app.use('/admin/product', AdminProductRoute);  // → src/routes/admin/product.ts
```

### Step 2: Route File → Get HTTP Methods + Validators
```typescript
// src/routes/general/products.ts
router.get('/all', 
  ...ProductValidator.validateProductQuery,  // ← Query params here
  ProductController.getAllProducts
);
```

### Step 3: Validator → Get Query Params & Limits
```typescript
// src/validators/ProductValidator.ts
page: { min: 1 }
limit: { min: 1, max: 100 }
search: { min: 2 }  // Min 2 characters
category: { isMongoId: true }
```

### Step 4: Model → Copy Types
```typescript
// src/models/Product.ts - Copy the schema structure
interface Product {
  _id: string;
  name: string;
  price: number;
  // ... copy from mongoose schema
}
```

### Step 5: Write Endpoint + Type
```typescript
// In your frontend endpoints.ts
export const api = {
  products: {
    list: '/products/all',
    byId: (id: string) => `/products/by-id/${id}`,
  }
};

// Usage with apiClient
const response = await apiClient.get<Product[]>(api.products.list, {
  params: { page: 1, limit: 20 }
});
```

## File Structure Map

```
src/server.ts                    → Route base paths
  ↓
src/routes/{group}/{name}.ts     → HTTP methods + middleware
  ↓
src/validators/{Name}Validator.ts → Query params + limits
  ↓
src/controllers/{name}Controller.ts → Thin handlers
  ↓
src/services/{name}Service.ts    → Business logic + response
  ↓
src/models/{Name}.ts             → TypeScript types
```

## Quick Examples

### Example 1: File Upload
```
server.ts: app.use('/files', FileUploadRoute)
  ↓
routes/general/fileUpload.ts: POST /upload/single
  ↓
validators/FileUploadValidator.ts: category (optional), allowed: ['product', 'campaign', ...]
  ↓
controllers/FileUploadController.ts: multer config (10MB, images only)
  ↓
Response: { path, url, size, mimetype, originalName }
```

**Integration**:
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('category', 'products');
const response = await apiClient.post<UploadedFile>('/files/upload/single', formData);
```

### Example 2: Get Products
```
server.ts: app.use('/products', ProductsRoute)
  ↓
routes/general/products.ts: GET /all
  ↓
validators/ProductValidator.ts:
  - page: min 1
  - limit: min 1, max 100
  - category: MongoDB ID
  - sortBy: 'price' | 'name' | 'createdAt' | 'rating' | 'sales'
  ↓
models/Product.ts: Copy Product interface
  ↓
Response: { data: Product[], meta: PaginationMeta }
```

**Integration**:
```typescript
const response = await apiClient.get<Product[]>('/products/all', {
  params: { page: 1, limit: 20, sortBy: 'price', sortOrder: 'asc' }
});
```

### Example 3: Admin Create Product
```
server.ts: app.use('/admin/product', AdminProductRoute)
  ↓
routes/admin/product.ts: POST /create (requires: authenticateUser, isAdmin, requirePermission('products', 'create'))
  ↓
validators/admin/Products.ts: createProductValidator
  ↓
models/Product.ts: Full schema with all required fields
  ↓
Response: { data: Product }
```

**Integration**:
```typescript
const response = await apiClient.post<Product>('/admin/product/create', {
  sku: 12345,
  name: 'Product Name',
  price: 29.99,
  // ... other required fields from model
});
```

## Response Structure (Standard)

All endpoints return:
```typescript
{
  message: string;
  data: T | null;
  meta?: {  // For paginated responses
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
}
```

**apiClient auto-unwraps**: `response.data.data` → `response.data`

## Authentication Middleware

- `authenticateUser` → JWT required in `Authorization: Bearer <token>`
- `isAdmin` → Must be owner/manager/employee
- `requirePermission(resource, action)` → Specific permission needed (owner bypasses)

## Common Query Param Limits

| Param | Validator Rule | Example |
|-------|---------------|---------|
| `page` | min: 1 | Default: 1 |
| `limit` | min: 1, max: 100 | Default: 10-20 |
| `search` | min length: 2 | Required for search endpoints |
| `category` | isMongoId | Valid MongoDB ObjectId |
| File upload | 10MB, images only | Max 10 files for multiple |

## Quick Integration Workflow

1. **Find base path** in `server.ts` (e.g., `/products`)
2. **Open route file** → `src/routes/general/products.ts`
3. **Check HTTP method** and endpoint path (e.g., `GET /all`)
4. **Check validator** for query params and limits
4. **Check controller** for how service is called
4. **Check service** for how its to be used
5. **Copy types** from `src/models/{Name}.ts` or whereever from types were used in the service
6. **Write endpoint** in `endpoints.ts`:
   ```typescript
   products: {
     list: '/products/all',
     byId: (id: string) => `/products/by-id/${id}`,
   }
   ```
7. **Use with apiClient**:
   ```typescript
   const response = await apiClient.get<Product[]>(api.products.list, {
     params: { page: 1, limit: 20 }
   });
   ```

## Route Groups from `server.ts`

### Public Routes
- `/auth` - Authentication (login, register, password reset)
- `/products` - Product browsing (public access)
- `/categories` - Category listing
- `/banners` - Banner images
- `/files` - File upload (auth required)
- `/reviews` - Product reviews

### User Routes (Auth Required)
- `/user` - User profile management
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/myorder` - User orders
- `/wishlist` - Wishlist management

### Admin Routes (Auth + Admin + Permissions)
- `/admin/product` - Product CRUD
- `/admin/category` - Category management
- `/admin/users` - User management
- `/admin/orders` - Order management
- `/admin/inventory` - Inventory management
- `/admin/analytics` - Analytics data

## Integration Time: ~2-3 minutes per endpoint

**Fastest workflow**:
1. `server.ts` → base path (10 seconds)
2. Route file → HTTP method (20 seconds)
3. Validator → params/limits (30 seconds)
4. Model → copy types (1 minute)
5. Write integration code (30 seconds)

Done! ✅
