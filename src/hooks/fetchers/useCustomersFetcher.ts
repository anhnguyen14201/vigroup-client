import { apiGetAllCustomers } from '@/api'
import { IUser } from '@/interface'

export interface CustomerFilters {
  searchTerm?: string
}

export interface CustomersResponse {
  data: IUser[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchCustomers({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: CustomerFilters
}): Promise<CustomersResponse> {
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
  }
  const res = await apiGetAllCustomers(params)
  const raw = res.data
  return {
    data: raw.data as IUser[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
