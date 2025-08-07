// src/hooks/fetchers/useProductsFetcher.ts
import { apiGetAllPublicOrders } from '@/api'

export interface OrderFilters {
  userId?: string
  searchTerm?: string
  sortBy?: 'productName' | 'price'
  sortOrder?: 'asc' | 'desc'
  localeCode?: string
}

export interface OrdersResponse {
  data: any[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchOrdersPage({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: OrderFilters
}): Promise<OrdersResponse> {
  const { userId, searchTerm, sortBy, sortOrder, localeCode } = filters
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    ...(searchTerm ? { searchTerm } : {}),
    ...(userId ? { userId } : {}),
    ...(localeCode ? { language: localeCode } : {}),
  }

  const res = await apiGetAllPublicOrders(params)
  const raw = res.data

  return {
    data: raw.data as any[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
