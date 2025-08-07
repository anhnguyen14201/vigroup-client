// lib/createFetcher.ts
import { cache } from 'react'

export function createPageFetcher<Args extends any[], D>(
  fetcher: (...args: Args) => Promise<{ data: { data: D } }>,
) {
  // cache chỉ wrap một lần, trả về same function reference
  const cachedFetcher = cache(async (...args: Args) => {
    const res = await fetcher(...args)
    return res.data.data
  })

  return cachedFetcher
}
