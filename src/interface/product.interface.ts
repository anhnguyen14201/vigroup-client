import { ILanguage } from '@/interface/language.interface'

export interface TranslationProject {
  language: ILanguage // hoặc { code: string } tuỳ structure
  metaDescription: string
  name?: string
}

// 1. Định nghĩa type cho 1 brand
export interface ProductBrand {
  _id: string
  name: string
  slug: string
  products: IProduct[]
  // Chứa tất cả các trường dạng field_locale, VD: metaDescription_en, metaDescription_vi
  [key: `${string}_${string}`]: string | number | undefined

  translations: TranslationProject[]
}

// 2. Props interface
export interface GetProductBrandColumnsProps {
  currentLang: string
  onEdit: (brand: ProductBrand) => void
  onDelete: (brand: ProductBrand) => void
}

export interface IProductCategory {
  _id: string
  name?: string
  translations: TranslationProject[]
  [key: string]: any
  // …có thể thêm bất cứ trường nào khác mà API trả về…
}
export interface GetProductCategoryColumnsProps {
  currentLang: string
  onEdit: (category: IProductCategory) => void
  onDelete: (category: IProductCategory) => void
}

export interface GetProductColumnsProps {
  currentLang: string
  onEdit: (product: IProduct) => void
  onDelete: (product: IProduct) => void
}

export interface ProductTranslation {
  code: string
  productName: string
  description: string
  metaDescription: string
}

export interface IProduct {
  _id: string
  code: string
  thumbnailUrls: string[]
  imageUrls: string[]
  translations: ProductTranslation[]
  cost: number
  price: number
  discount: number
  tax: number
  quantity: number
  isFeatured: boolean
  isNewArrival: boolean
  categoryIds: string[]
  brandIds: string[]
  name: string
  stockStatus: string
  productName?: string
  slug?: string
  shortDesc?: string
}
