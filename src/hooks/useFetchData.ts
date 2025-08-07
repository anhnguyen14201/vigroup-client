// src/hooks/useLogos.ts
import { useGenericData } from './useGenericData'
import {
  apiGetAllProductBrands,
  apiGetAllProductCategories,
  apiGetAllProjectsByEmmployee,
  apiGetAllProjectTypes,
  apiGetAttendanceByDate,
  apiGetAttendanceByMonth,
  apiGetAttendanceByProjectAndEmployees,
  apiGetInfor,
  apiGetInforCompany,
  apiGetInstallation,
  apiGetLanguage,
  apiGetOrderById,
  apiGetPrivateInfor,
  apiGetProductsByIds,
  apiGetProjectById,
  apiGetPublicLogo,
  apiGetSlidePrivate,
  apiGetUserById,
} from '@/api'
import type { ILogo, IProject } from '@/interface'
import useSWR, { KeyedMutator, mutate } from 'swr'

export function useLogos() {
  return useGenericData<ILogo, []>(
    '/logo',
    () => apiGetPublicLogo().then(r => r.data.data),
    [],
    { filter: s => s.activity },
  )
}

export function useProjectsByEmployee() {
  return useSWR('/project/projects-by-employee', () =>
    apiGetAllProjectsByEmmployee().then(res => res.data.data),
  )
}

export function useAttendanceByDate({ employeeId, date }: any) {
  return useSWR(
    ['/attendance', employeeId, date], // composite key
    () =>
      apiGetAttendanceByDate({ employeeId, date }).then(res => res.data.data),
  )
}

export function useAttendanceByMonth({ employeeId, month }: any) {
  return useSWR(['/attendance-by-month/', employeeId, month], () =>
    apiGetAttendanceByMonth({ employeeId, month }).then(res => res.data.data),
  )
}

export function usePrivateInfor() {
  return useGenericData(
    '/infor/private-infor',
    () => apiGetPrivateInfor().then(r => r.data.data),
    [],
    {
      /* filter: (s: any) => s.activity  */
    },
  )
}

export function usePublicInfor() {
  return useGenericData(
    '/infor',
    () => apiGetInfor().then(r => r.data.data),
    [],
    {
      filter: (s: any) => s.activity,
    },
  )
}

export function useInforCompany() {
  return useGenericData(
    '/company', // SWR key
    () => apiGetInforCompany().then(r => r.data.data), // fetcher -> ISlide[]
    [], // args for fetcher
    {},
  )
}

export function usePriavteSlides() {
  return useGenericData(
    '/slide',
    () => apiGetSlidePrivate().then(r => r.data.data),
    [],
    {
      /*       filter: (s: any) => s.activity,
      sort: (a, b) => a.order - b.order, */
    },
  )
}

export function useCategories() {
  return useGenericData(
    '/category',
    () => apiGetAllProductCategories().then(r => r.data.data),
    [],
    {
      /*       filter: (s: any) => s.activity,
      sort: (a, b) => a.order - b.order, */
    },
  )
}

export function useOrderById(id?: string) {
  return useSWR(
    // Nếu id undefined, SWR sẽ không gọi fetcher
    id ? `/project/${id}` : null,
    () => apiGetOrderById(id!).then(res => res.data.data),
    defaultConfig,
  )
}

export function useGetUserById(id: string) {
  return useSWR(
    id ? `/user/${id}` : null,
    () => apiGetUserById(id).then(r => r.data.data),
    defaultConfig,
  )
}

export function useInstallations() {
  return useGenericData(
    '/installation',
    () => apiGetInstallation().then(r => r.data.data),
    [],
    {
      /*       filter: (s: any) => s.activity,
      sort: (a, b) => a.order - b.order, */
    },
  )
}

export function useBrands() {
  return useGenericData(
    '/brand',
    () => apiGetAllProductBrands().then(r => r.data.data),
    [],
    {
      /*       filter: (s: any) => s.activity,
      sort: (a, b) => a.order - b.order, */
    },
  )
}

export function useProductsByIds(ids: string[]) {
  const SWR_KEY = '/cart/products' // 1 key cố định

  const {
    data,
    error,
    isValidating,
    mutate,
  }: {
    data?: any[]
    error?: any
    isValidating: boolean
    mutate: KeyedMutator<any[]>
  } = useSWR(
    SWR_KEY,
    // fetcher: chỉ chạy 1 lần khi mount, vì ta sẽ disable revalidate tự động
    () => apiGetProductsByIds(ids).then(res => res.data.data),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true, // chỉ mount lần đầu
      refreshInterval: 0,
    },
  )

  // Xoá local cache + xoá persist
  const removeFromCartSwr = (idToRemove: string) => {
    // 1) Cập nhật SWR cache ngay
    mutate((current = []) => current.filter(p => p._id !== idToRemove), false)
    // 2) Dispatch xoá trong Redux/Persist
    // dispatch(removeFromCart(idToRemove))
  }

  return {
    items: data || [],
    isLoading: isValidating,
    removeFromCartSwr,
    error,
    // nếu muốn thêm 1 sản phẩm mới: tự fetch chỉ 1 cái mới rồi mutate thêm vào
    addToCartSwr: async (newIds: string[]) => {
      const fresh = await apiGetProductsByIds(newIds).then(r => r.data.data)
      mutate((current = []) => [...current, ...fresh], false)
    },
  }
}

export function useProductsByIdsFresh(ids: string[]) {
  const key = ids.length > 0 ? `/product/products?ids=${ids.join(',')}` : null

  const { data, error, isValidating } = useSWR(
    key,
    () => apiGetProductsByIds(ids).then(res => res.data.data),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    items: data || [],
    isLoading: !error && isValidating,
    error,
  }
}

export function useAttendanceByProjectAndEmployees(
  projectId: string,
  employeeIds: string[],
) {
  // Chỉ fetch khi có projectId và ít nhất 1 employeeId

  const shouldFetch =
    Boolean(projectId) && Array.isArray(employeeIds) && employeeIds.length > 0

  // Dùng key dạng array để SWR phân biệt params
  const key = shouldFetch
    ? `/attendance/by-project?projectId=${projectId}?employeeIds=${employeeIds.join(
        ',',
      )}`
    : null

  const { data, error, isValidating } = useSWR(
    key,
    // fetcher nhận về cả URL key và params
    () =>
      apiGetAttendanceByProjectAndEmployees(projectId, employeeIds).then(
        res => res.data.data,
      ),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    attendanceByEmployee: data || {}, // object { [employeeId]: AttendanceRecord[] }
    isLoading: shouldFetch && isValidating,
    isError: !!error,
    mutate: () => mutate(key),
  }
}

export function useProjectType() {
  return useGenericData(
    '/project-type',
    () => apiGetAllProjectTypes().then(r => r.data.data),
    [],
    {
      /*       filter: (s: any) => s.activity,
      sort: (a, b) => a.order - b.order, */
    },
  )
}

export function useLanguage() {
  return useGenericData(
    '/language',
    () => apiGetLanguage().then(r => r.data.data),
    [],
    {
      /*       filter: (s: any) => s.activity,
      sort: (a, b) => a.order - b.order, */
    },
  )
}
const defaultConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}

export function useProjectById(id?: string) {
  return useSWR<IProject>(
    // Nếu id undefined, SWR sẽ không gọi fetcher
    id ? `/project/${id}` : null,
    () => apiGetProjectById(id!).then(res => res.data.data),
    defaultConfig,
  )
}
