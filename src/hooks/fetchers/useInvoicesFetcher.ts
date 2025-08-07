// src/hooks/fetchers/useProductsFetcher.ts
import { apiGetAllQuotes } from '@/api'
import { apiGetAllProductsPrivate } from '@/api/productApi'
import { IProduct } from '@/interface'

export interface FiltersInvoices {
  categoryId?: string
  brandId?: string
  searchTerm?: string
  sortBy?: 'productName' | 'price'
  sortOrder?: 'asc' | 'desc'
  localeCode?: string
}

export interface ProductsInvoices {
  data: IProduct[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchInvoices({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: FiltersInvoices
}): Promise<ProductsInvoices> {
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

  const res = await apiGetAllQuotes(params)
  const raw = res.data

  return {
    data: raw.data as IProduct[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
