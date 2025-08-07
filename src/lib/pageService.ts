// lib/pageService.ts
import { createPageFetcher } from '@/lib/createFetcher'
import {
  apiGetAllProductBrands,
  apiGetAllProductCategories,
  apiGetPageBySlug,
  apiGetProductBySlug,
  apiGetProjectById,
  apiGetProjectBySlug,
  apiGetRelatedProductBySlug,
  apiGetSlidePublic,
} from '@/api'

export const getPageBySlug = createPageFetcher(apiGetPageBySlug)
export const getPublicSlides = createPageFetcher(apiGetSlidePublic)
export const getProductBySlug = createPageFetcher(apiGetProductBySlug)
export const getProjectBySlug = createPageFetcher(apiGetProjectBySlug)
export const getProjectById = createPageFetcher(apiGetProjectById)
export const getBrands = createPageFetcher(apiGetAllProductBrands)
export const getCategories = createPageFetcher(apiGetAllProductCategories)
export const getRelatedProductBySlug = createPageFetcher(
  apiGetRelatedProductBySlug,
)
