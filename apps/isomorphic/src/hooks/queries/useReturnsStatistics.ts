'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';

export interface ReturnStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  cancelled: number;
  totalRefundAmount: number;
  averageRefundAmount: number;
  byReason: Array<{
    reason: string;
    count: number;
  }>;
  byType: {
    refund: number;
    exchange: number;
  };
  recentReturns: number;
}

export const useReturnsStatistics = () => {
  return useQuery<ReturnStatistics>({
    queryKey: ['returns', 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get<ReturnStatistics>(api.returns.statistics);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
