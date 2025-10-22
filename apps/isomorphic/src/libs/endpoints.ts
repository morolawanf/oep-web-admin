// API endpoints for use with apiClient (which already has baseURL configured)
// No need to prefix with BASE_URL since axios instance handles that
export const api = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    providerLogin: '/auth/login/provider',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyOtp: '/auth/verifyAccount',
    resendOtp: '/auth/resendVerifyAccountOtp',
    changePassword: '/auth/changePassword',
    requestResetPasswordCode: '/auth/requestResetPasswordCode',
    resetPasswordByCode: '/auth/resetPasswordByCode',
    passwordAndProviderStatus: '/auth/passwordAndProviderStatus',
    setPassword: '/auth/setPassword',
  },

  // User endpoints
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/password/change',
    permissions: '/admin/users/permissions',
    // Address endpoints
    addresses: '/user/address/all',
    addAddress: '/user/address',
    updateAddress: (addressId: string) => `/user/address/${addressId}`,
    deleteAddress: (addressId: string) => `/user/address/${addressId}`,
  },

  // Product endpoints
  products: {
    list: '/products',
    byId: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    byCategory: (categoryId: string) => `/products/category/${categoryId}`,
    search: '/products/search',
    featured: '/products/featured',
    newArrivals: '/products/new-arrivals',
  },

  // Category endpoints
  categories: {
    list: '/categories',
    byId: (id: string) => `/categories/${id}`,
    create: '/categories',
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },

  // Order endpoints
  orders: {
    list: '/admin/orders',
    byId: (id: string) => `/admin/orders/${id}`,
    updateStatus: (id: string) => `/admin/orders/${id}/status`,
    statistics: '/admin/orders/statistics',
  },

  // Customer endpoints
  customers: {
    list: '/admin/customers',
    byId: (id: string) => `/admin/customers/${id}`,
    statistics: '/admin/customers/statistics',
  },

  // Inventory endpoints
  inventory: {
    list: '/admin/inventory',
    byId: (id: string) => `/admin/inventory/${id}`,
    update: (id: string) => `/admin/inventory/${id}`,
    lowStock: '/admin/inventory/low-stock',
  },

  // Analytics endpoints
  analytics: {
    dashboard: '/admin/analytics/dashboard',
    sales: '/admin/analytics/sales',
    revenue: '/admin/analytics/revenue',
    products: '/admin/analytics/products',
  },

  // Banner/Marketing endpoints
  banners: {
    list: '/admin/banners',
    byId: (id: string) => `/admin/banners/${id}`,
    create: '/admin/banners',
    update: (id: string) => `/admin/banners/${id}`,
    delete: (id: string) => `/admin/banners/${id}`,
  },

  // Review endpoints
  reviews: {
    list: '/admin/reviews',
    byProduct: (productId: string) => `/products/${productId}/reviews`,
    approve: (reviewId: string) => `/admin/reviews/${reviewId}/approve`,
    delete: (reviewId: string) => `/admin/reviews/${reviewId}`,
  },

  // Settings endpoints
  settings: {
    general: '/admin/settings/general',
    shipping: '/admin/settings/shipping',
    payment: '/admin/settings/payment',
    notifications: '/admin/settings/notifications',
  },

  // File upload endpoints
  fileUpload: {
    single: '/files/upload/single',
    multiple: '/files/upload/multiple',
    byCategory: (category: string) => `/files/category/${category}`,
  },

  // Role Management endpoints
  roles: {
    list: '/admin/roles',
    byId: (id: string) => `/admin/roles/${id}`,
    create: '/admin/roles',
    update: (id: string) => `/admin/roles/${id}`,
    delete: (id: string) => `/admin/roles/${id}`,
    toggleStatus: (id: string) => `/admin/roles/${id}/toggle-status`,
  },

  // Staff Management endpoints
  staff: {
    list: '/admin/users/staff',
    changeRole: (id: string) => `/admin/roles/users/${id}/role`,
    assignRoles: (id: string) => `/admin/roles/users/${id}/assign-roles`,
    editRoles: (id: string) => `/admin/roles/users/${id}/edit-roles`,
    permissions: (id: string) => `/admin/roles/users/${id}/permissions`,
    suspend: (id: string) => `/admin/users/${id}/suspend`,
    delete: (id: string) => `/admin/users/${id}`,
    addEmployee: '/admin/roles/users/add-employee',
    revokeAccess: (id: string) => `/admin/roles/users/${id}/revoke-access`,
    userRoles: (id: string) => `/admin/roles/users/${id}/roles`,
  },

  // User Management endpoints (all users, not just staff)
  users: {
    list: '/admin/users/all', // Get all users with pagination and filters
    byId: (id: string) => `/admin/users/${id}`, // Get user details with orders, reviews, wishlist
    staff: '/admin/users/staff', // Get staff only (employees and owners)
    suspend: (id: string) => `/admin/users/${id}/suspend`, // Suspend/unsuspend user
    delete: (id: string) => `/admin/users/${id}`, // Delete user
    updateRole: (id: string) => `/admin/users/${id}/role`, // Update user role
  },
} as const;

export default api;
