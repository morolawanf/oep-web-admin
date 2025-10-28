"use client";

import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/libs/axios";
import api from "@/libs/endpoints";
import toast from "react-hot-toast";
import type { Shipment } from "@/types/shipment.types";
import deliveryKeys from "@/hooks/queries/useDeliveries";

export interface UpdateDeliveryStatusInput {
  status: Shipment["status"];
  note?: string;
}

export interface AddDeliveryTrackingInput {
  status: Shipment["status"];
  location: string;
  description: string;
  timestamp?: string;
}

export interface UpdateDeliveryNotesInput {
  notes: string;
}

export const useDeliveryUpdateStatus = (
  deliveryId: string,
  options?: Omit<UseMutationOptions<Shipment, Error, UpdateDeliveryStatusInput, unknown>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<Shipment, Error, UpdateDeliveryStatusInput>({
    mutationFn: async (data: UpdateDeliveryStatusInput) => {
      const response = await apiClient.patch<Shipment>(api.delivery.updateStatus(deliveryId), data);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.detail(deliveryId) });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
      toast.success("Delivery status updated");
      options?.onSuccess?.(data, variables, context as any);
    },
    onError: (error, variables, context) => {
      toast.error(handleApiError(error));
      options?.onError?.(error, variables, context as any);
    },
    ...options,
  });
};

export const useDeliveryAddTracking = (
  deliveryId: string,
  options?: Omit<UseMutationOptions<Shipment, Error, AddDeliveryTrackingInput, unknown>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<Shipment, Error, AddDeliveryTrackingInput>({
    mutationFn: async (data: AddDeliveryTrackingInput) => {
      const response = await apiClient.post<Shipment>(api.delivery.addTracking(deliveryId), data);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.detail(deliveryId) });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
      toast.success("Tracking update added");
      options?.onSuccess?.(data, variables, context as any);
    },
    onError: (error, variables, context) => {
      toast.error(handleApiError(error));
      options?.onError?.(error, variables, context as any);
    },
    ...options,
  });
};

export const useDeliveryUpdateNotes = (
  deliveryId: string,
  options?: Omit<UseMutationOptions<Shipment, Error, UpdateDeliveryNotesInput, unknown>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<Shipment, Error, UpdateDeliveryNotesInput>({
    mutationFn: async (data: UpdateDeliveryNotesInput) => {
      const response = await apiClient.patch<Shipment>(api.delivery.updateNotes(deliveryId), data);
      return response.data!;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.detail(deliveryId) });
      toast.success("Notes updated");
      options?.onSuccess?.(data, variables, context as any);
    },
    onError: (error, variables, context) => {
      toast.error(handleApiError(error));
      options?.onError?.(error, variables, context as any);
    },
    ...options,
  });
};
