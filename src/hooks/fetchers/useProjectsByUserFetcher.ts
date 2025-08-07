import { apiGetAllProjectsByUser } from '@/api'
import { IProject } from '@/interface'

export interface ProjectByUserFilters {
  searchTerm?: string
  kind?: string
  projectType?: string
  userId?: string
}

export interface ProjectByUserResponse {
  data: IProject[]
  totalPages: number
  totalItems: number
}

const PAGE_SIZE = 10

export async function fetchByUserProjects({
  pageIndex,
  filters,
}: {
  pageIndex: number
  filters: ProjectByUserFilters
}): Promise<ProjectByUserResponse> {
  const { kind, searchTerm, projectType, userId } = filters
  const params: Record<string, any> = {
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
    ...(kind ? { kind } : {}),
    ...(userId ? { userId } : {}),
    ...(projectType ? { projectType } : {}),
  }
  const res = await apiGetAllProjectsByUser(params)
  const raw = res.data
  return {
    data: raw.data as IProject[],
    totalPages: raw.totalPages,
    totalItems: raw.totalItems,
  }
}
