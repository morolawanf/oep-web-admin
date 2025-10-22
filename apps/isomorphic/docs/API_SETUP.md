# API Setup - oep-web-admin

This document describes the API integration setup for the oep-web-admin dashboard.

## Overview

The API integration uses a modern, type-safe approach with:
- **Axios** for HTTP requests with custom interceptors
- **React Query** (@tanstack/react-query) for server state management
- **Zustand** for client/UI state management
- **NextAuth** for automatic authentication token injection

## File Structure

```
src/
├── libs/
│   ├── axios.ts           # Axios client with interceptors & type-safe wrappers
│   ├── endpoints.ts       # Centralized API endpoint definitions
│   └── apiRoutes.ts       # Legacy route builder (auth endpoints)
├── hooks/
│   ├── queries/           # React Query hooks for data fetching
│   │   └── useUserProfile.ts
│   └── mutations/         # React Query hooks for data mutations
│       └── useUpdateProfile.ts
└── store/                 # Zustand stores for UI state
    └── (create stores here)
```

## Key Features

### 1. Axios Client (`src/libs/axios.ts`)

**Automatic Features**:
- ✅ Auth token injection from NextAuth session
- ✅ Response data unwrapping (`response.data.data` → `response.data`)
- ✅ Request ID generation for tracking
- ✅ Development logging
- ✅ Global error handling
- ✅ 401 redirect handling
- ✅ Type-safe responses

**Usage**:
```typescript
import { apiClient } from '@/libs/axios';

// GET request - data is automatically unwrapped
const response = await apiClient.get<User>('/user/profile');
console.log(response.data); // User object, not { data: User }

// POST request
const created = await apiClient.post<Product>('/products', productData);
console.log(created.data); // Product object
console.log(created.message); // Success message from backend
```

### 2. Endpoints (`src/libs/endpoints.ts`)

Centralized endpoint definitions with type safety:

```typescript
import api from '@/libs/endpoints';

// Static endpoints
api.auth.login              // '/auth/login'
api.user.profile            // '/user/profile'

// Dynamic endpoints (functions)
api.products.byId('123')    // '/products/123'
api.orders.updateStatus('456') // '/admin/orders/456/status'
```

### 3. React Query Hooks

#### **Query Hooks** (`src/hooks/queries/`)

For data fetching (GET requests):

```typescript
// src/hooks/queries/useUserProfile.ts
export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await apiClient.get<UserProfile>(api.user.profile);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Usage in component
const { data, isLoading, error } = useUserProfile();
```

#### **Mutation Hooks** (`src/hooks/mutations/`)

For data changes (POST, PUT, DELETE):

```typescript
// src/hooks/mutations/useUpdateProfile.ts
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const response = await apiClient.put<UserProfile>(
        api.user.updateProfile,
        data
      );
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated');
    },
  });
};

// Usage in component
const updateProfile = useUpdateProfile();
updateProfile.mutate({ firstName: 'John' });
```

### 4. Zustand Stores (`src/store/`)

For UI/client state (NOT server data):

```typescript
// src/store/useSidebarStore.ts
import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

// Usage
const { isOpen, toggle } = useSidebarStore();
```

## Authentication

**Automatic Token Injection**: The axios client automatically retrieves the auth token from NextAuth session and adds it to all requests.

```typescript
// No manual token management needed!
const response = await apiClient.get('/protected-endpoint');
// Authorization: Bearer <token> is automatically added
```

## Error Handling

### Global Error Handler

```typescript
import { handleApiError } from '@/libs/axios';

try {
  await apiClient.post('/api/endpoint', data);
} catch (error) {
  const message = handleApiError(error);
  toast.error(message); // User-friendly error message
}
```

### React Query Error Handling

```typescript
const { data, error, isError } = useProducts();

if (isError) {
  return <div>Error: {handleApiError(error)}</div>;
}
```

## Best Practices

### ✅ Do's

1. **Always use `apiClient`** - Don't use `fetch()` directly
2. **Use endpoint constants** - Import from `api` object
3. **Create dedicated hooks** - One hook per query/mutation
4. **Invalidate queries** - After mutations to refresh data
5. **Handle errors** - Use toast notifications for user feedback
6. **Type everything** - Define interfaces for all data structures
7. **Use Zustand for UI state** - Not for server data

### ❌ Don'ts

1. **Don't hardcode URLs** - Use `api` endpoints
2. **Don't use `any` types** - Define proper interfaces
3. **Don't store server data in Zustand** - Use React Query
4. **Don't mutate cache directly** - Use `invalidateQueries`
5. **Don't ignore errors** - Always handle error states
6. **Don't duplicate logic** - Create reusable hooks
7. **Don't mix concerns** - Keep queries and mutations separate

## Examples

### Complete Feature Implementation

```typescript
// 1. Define endpoint
// src/libs/endpoints.ts
export const api = {
  products: {
    list: '/products',
    byId: (id: string) => `/products/${id}`,
    create: '/products',
    delete: (id: string) => `/products/${id}`,
  },
};

// 2. Create query hook
// src/hooks/queries/useProducts.ts
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get<Product[]>(api.products.list);
      return response.data!;
    },
  });
};

// 3. Create mutation hook
// src/hooks/mutations/useDeleteProduct.ts
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(api.products.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
  });
};

// 4. Use in component
// app/products/products-client.tsx
'use client';

export default function ProductsClient() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {products?.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <button onClick={() => handleDelete(product._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Migration from Old Patterns

If you see old code using:
- `fetch()` directly → Migrate to `apiClient`
- Hardcoded URLs → Use `api` endpoints
- Context for server data → Migrate to React Query
- Manual token management → Remove (axios handles it)

## Testing

```typescript
// Mock apiClient in tests
jest.mock('@/libs/axios', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Test query hook
const { result } = renderHook(() => useProducts(), {
  wrapper: createQueryClientWrapper(),
});

await waitFor(() => expect(result.current.isSuccess).toBe(true));
expect(result.current.data).toHaveLength(5);
```

## Resources

- **Full Guide**: `.github/copilot-instructions.md`
- **React Query Docs**: https://tanstack.com/query/latest/docs/react/overview
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **Axios Docs**: https://axios-http.com/docs/intro

## Environment Setup

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Support

For questions or issues with the API setup:
1. Check `.github/copilot-instructions.md` for patterns
2. Look at existing hooks in `src/hooks/queries/` and `src/hooks/mutations/`
3. Review `src/libs/axios.ts` for client configuration

**Remember**: Always use type-safe patterns and handle errors gracefully!
