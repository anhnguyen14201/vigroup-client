// src/hooks/useList.ts
import useSWR from 'swr'
import { useMemo, useState } from 'react'

/**
 * SWR defaults shared across all calls
 */
const defaultSWRConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}

export interface ListOptions<T> {
  /**
   * Optional filter function to pick which items to include
   */
  filter?: (item: T) => boolean
  /**
   * Optional compare fn to sort the list
   */
  sort?: (a: T, b: T) => number
  /**
   * Initial index for things like sliders
   */
  initialIndex?: number
}

/**
 * Generic hook for fetching & managing an array of T
 *
 * @param key     SWR cache key
 * @param fetcher any function that returns Promise<T[]>
 * @param args    arguments to pass to fetcher
 * @param options filter/sort/initialIndex
 */
export function useGenericData<T, A extends any[]>(
  key: string,
  fetcher: (...args: A) => Promise<T[]>,
  args: A,
  options: ListOptions<T> = {},
) {
  const { filter, sort, initialIndex = 0 } = options

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetcher(...args),
    defaultSWRConfig,
  )

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [] as T[]
    let arr = [...data]
    if (filter) arr = arr.filter(filter)
    if (sort) arr = arr.sort(sort)
    return arr
  }, [data, filter, sort])

  const [currentIdx, setCurrentIdx] = useState(initialIndex)
  return {
    items,
    currentIdx,
    setCurrentIdx,
    isLoading,
    error,
    mutate,
  }
}
