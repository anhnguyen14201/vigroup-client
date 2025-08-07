import { apiGetAllProjects } from '@/api'
import { IProject } from '@/interface'

export interface EmployeeFilters {
  searchTerm?: string
  kind?: string
}

export interface EmployeeResponse {
  data: IProject[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchProjects({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: EmployeeFilters
}): Promise<EmployeeResponse> {
  const { kind, searchTerm } = filters
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
    ...(kind ? { kind } : {}),
  }
  const res = await apiGetAllProjects(params)
  const raw = res.data
  return {
    data: raw.data as IProject[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
