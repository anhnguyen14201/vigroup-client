import { apiGetAllPublicProjects } from '@/api'
import { IProject } from '@/interface'

export interface ProjectPublicFilters {
  searchTerm?: string
  kind?: string
  projectType?: string
  userId?: string
}

export interface ProjectPublicResponse {
  data: IProject[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchPublicProjects({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: ProjectPublicFilters
}): Promise<ProjectPublicResponse> {
  const { kind, searchTerm, projectType, userId } = filters
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
    ...(kind ? { kind } : {}),
    ...(userId ? { userId } : {}),
    ...(projectType ? { projectType } : {}),
  }
  const res = await apiGetAllPublicProjects(params)
  const raw = res.data
  return {
    data: raw.data as IProject[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
