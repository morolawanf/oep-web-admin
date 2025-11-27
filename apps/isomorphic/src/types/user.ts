export type UserRole = 'user' | 'employee' | 'manager' | 'owner';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  suspended: boolean;
  emailVerified: boolean;
  image?: string;
  country?: string;
  dob?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserListItem extends User {
  joinedAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface UserDetails {
  user: User;
  orders: Order[];
  wishlistCount: number;
  totalOrders: number;
  totalSpent: number;
  totalReturns: number;
  reviews: Review[];
  totalReviewCount: number;
  averageReviewRating: number;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
  };
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  sort?: '1' | '-1';
}

export interface UserListResponse {
  message: string;
  data: UserListItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UserDetailsResponse {
  message: string;
  data: UserDetails;
}

export interface StaffListResponse {
  message: string;
  data: {
    users: UserListItem[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
}
