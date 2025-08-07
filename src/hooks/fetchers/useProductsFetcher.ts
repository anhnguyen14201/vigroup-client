// src/hooks/fetchers/useProductsFetcher.ts
import { apiGetAllProducts } from '@/api'
import { IProduct } from '@/interface'

export interface Filters {
  categoryId?: string
  brandId?: string
  searchTerm?: string
  sortBy?: 'productName' | 'price'
  sortOrder?: 'asc' | 'desc'
  localeCode?: string
}

export interface ProductsResponse {
  data: IProduct[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchProductsPage({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: Filters
}): Promise<ProductsResponse> {
  const { categoryId, brandId, searchTerm, sortBy, sortOrder, localeCode } =
    filters
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    ...(searchTerm ? { searchTerm } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(brandId ? { brandId } : {}),
    ...(localeCode ? { language: localeCode } : {}),
  }

  const res = await apiGetAllProducts(params)
  const raw = res.data

  return {
    data: raw.data as IProduct[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
