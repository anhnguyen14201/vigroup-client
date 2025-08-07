// src/hooks/fetchers/useProductsFetcher.ts
import { apiGetAllOrders, apiGetAllPublicOrders } from '@/api'
import { IProduct } from '@/interface'

export interface OrderPrivateFilters {
  userId?: string
  searchTerm?: string
  sortBy?: 'productName' | 'price'
  sortOrder?: 'asc' | 'desc'
  localeCode?: string
}

export interface OrdersPrivateResponse {
  data: IProduct[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchPrivateOrdersPage({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: OrderPrivateFilters
}): Promise<OrdersPrivateResponse> {
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

  const res = await apiGetAllOrders(params)
  const raw = res.data

  return {
    data: raw.data as IProduct[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
