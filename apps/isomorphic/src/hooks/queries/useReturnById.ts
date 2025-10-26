'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';
import { Return } from './useReturns';

export const useReturnById = (id: string) => {
  return useQuery<Return>({
    queryKey: ['return', id],
    queryFn: async () => {
      const response = await apiClient.get<Return>(api.returns.byId(id));
      return response.data!;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
