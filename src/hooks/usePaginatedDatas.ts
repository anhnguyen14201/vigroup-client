// hooks/usePaginatedData.ts
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

/**
 * Định nghĩa dạng response phân trang chung
 */
export interface PaginatedResponse<T> {
  data: T[]
  totalPages: number
  totalItems: number
}

/**
 * Hook chung cho phân trang với SWR Infinite
 *
 * @typeParam T   Kiểu từng item trong danh sách
 * @typeParam F   Kiểu filters/params (mặc định là undefined)
 *
 * @param filters    Đối tượng lọc hoặc params gắn kèm (có thể là undefined)
 * @param fetcher    Hàm gọi API: ({ pageIndex, filters }) => Promise<PaginatedResponse<T>>
 * @param swrConfig  (Tùy chọn) Cấu hình SWR Infinite
 */
export function usePaginatedDatas<T, F = undefined>(
  key: string,
  filters: F,
  fetcher: (args: {
    pageIndex: number
    filters: F
  }) => Promise<PaginatedResponse<T>>,
  swrConfig?: SWRInfiniteConfiguration<PaginatedResponse<T>, any>,
) {
  const { data, error, size, setSize, mutate } = useSWRInfinite<
    PaginatedResponse<T>
  >(
    // key loader: trả về null để ngừng gọi thêm trang
    (pageIndex, previousPage) =>
      previousPage && pageIndex + 1 > previousPage.totalPages
        ? null
        : { key, pageIndex, filters },

    // fetcher lấy đúng param
    fetcher,

    // mặc định tắt các revalidate: bạn có thể override qua swrConfig
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...swrConfig,
    },
  )

  // gom tất cả data lại thành 1 mảng
  const items: T[] = data ? data.flatMap(page => page.data) : []
  const totalPages = data?.[0]?.totalPages ?? 0
  const totalItems = data?.[0]?.totalItems ?? 0

  // trạng thái load
  const isLoadingInitial = !data && !error
  const isLoadingMore =
    isLoadingInitial || (size > 0 && typeof data?.[size - 1] === 'undefined')
  const isReachingEnd = data ? size >= totalPages : false

  const loadMore = () => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1)
    }
  }

  return {
    items,
    totalItems,
    totalPages,
    isLoading: isLoadingInitial,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    error,
    mutate, // expose để manual revalidate
  }
}
