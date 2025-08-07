import { apiGetSummary } from '@/api'
import { IUser } from '@/interface'

export interface EmployeeFilterss {
  searchTerm?: string
  month?: any
  year?: any
}

export interface EmployeesResponses {
  data: IUser[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchEmployee({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: EmployeeFilterss
}): Promise<EmployeesResponses> {
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.month ? { month: filters.month } : {}),
    ...(filters.year ? { year: filters.year } : {}),
  }
  const res = await apiGetSummary(params)
  const raw = res.data
  return {
    data: raw.data as IUser[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
