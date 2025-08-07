import { apiGetAllCustomers, apiGetNonCustomers } from '@/api'
import { IUser } from '@/interface'

export interface EmployeeFilters {
  searchTerm?: string
}

export interface EmployeeResponse {
  data: IUser[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchEmployees({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: EmployeeFilters
}): Promise<EmployeeResponse> {
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
  }
  const res = await apiGetNonCustomers(params)
  const raw = res.data
  return {
    data: raw.data as IUser[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
