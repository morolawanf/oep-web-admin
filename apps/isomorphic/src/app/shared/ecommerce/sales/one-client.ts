// sales client for fetching a single sale by id (mock, replace with real API later)
import { salesData } from '@/data/sales-data';

export async function getSaleById(id: string) {
  // In a real app, replace with fetch(`/api/sales/${id}`) or similar
  return Promise.resolve(salesData.find((sale) => sale._id === id) || null);
}

export type Sale = (typeof salesData)[number];
