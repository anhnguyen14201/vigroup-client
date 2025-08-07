'use client'

import { useCallback, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type UseFetchDataProps = {
  type: string
  fetchAction: (args: { page: number; limit: number; value: string }) => void
  setPageAction: (page: number) => void
  debouncedValue: string
  setSearchInput: (value: string) => void
  PAGE_LIMIT: number
}

export const useFetchData = ({
  type, // 'products', 'users', 'invoices'
  fetchAction,
  setPageAction,
  debouncedValue,
  setSearchInput,
  PAGE_LIMIT,
}: UseFetchDataProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryPageKey = `${type}Page`
  const queryValueKey = `${type}Value`

  const fetchData = useCallback(
    (page = 1, value = '') => {
      const params = new URLSearchParams(window.location.search)
      params.set(queryPageKey, String(page))
      if (value) {
        params.set(queryValueKey, value)
      } else {
        params.delete(queryValueKey)
      }
      router.replace(`?${params.toString()}`)

      setPageAction(page)
      fetchAction({ page, limit: PAGE_LIMIT, value })
    },
    [
      fetchAction,
      setPageAction,
      router,
      PAGE_LIMIT,
      queryPageKey,
      queryValueKey,
    ],
  )

  useEffect(() => {
    const page = Number(searchParams.get(queryPageKey) || '1')
    const value = searchParams.get(queryValueKey) || ''
    setSearchInput(value)
    fetchData(page, value)
  }, [searchParams, fetchData, queryPageKey, queryValueKey, setSearchInput])

  useEffect(() => {
    fetchData(1, debouncedValue)
  }, [debouncedValue, fetchData])
}
