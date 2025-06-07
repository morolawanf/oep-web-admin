// sales client for fetching all sales (mock, replace with real API later)
import { salesData } from '@/data/sales-data';

export async function getAllSales() {
  // In a real app, replace with fetch('/api/sales') or similar
  return Promise.resolve(salesData);
}

export type Sale = (typeof salesData)[number];
