'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Return {
  _id: string;
  returnNumber: string;
  order: {
    _id: string;
    total: number;
    createdAt: string;
  };
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  items: ReturnItem[];
  type: 'refund' | 'exchange';
  reason: string;
  status: 'pending' | 'cancelled' | 'approved' | 'rejected' | 'items_received' | 'inspecting' | 'inspection_passed' | 'inspection_failed' | 'completed';
  refundStatus?: 'processed' | 'failed' | 'pending';
  refundAmount?: number;
  refundMethod?: 'paystack' | 'store_credit' | 'bank_transfer';
  refundTransactionId?: string;
  adminNotes?: string;
  requestedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnsFilters {
  status?: string;
  userId?: string;
  orderId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReturnsResponse {
  data: Return[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useReturns = (filters: ReturnsFilters = {}) => {
  return useQuery<ReturnsResponse>({
    queryKey: ['returns', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get<ReturnsResponse>(`${api.returns.list}?${params}`);
      return response.data!;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useReturnById = (id: string) => {
  return useQuery<Return>({
    queryKey: ['return', id],
    queryFn: async () => {
      const response = await apiClient.get<Return>(api.returns.byId(id));
      return response.data!;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
