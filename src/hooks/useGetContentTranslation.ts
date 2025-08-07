import { languageMap } from '@/constants'
import { Locale } from '@/interface'

export interface TranslationItem {
  language: string
  [key: string]: unknown
}

export interface WithTranslations<T extends TranslationItem> {
  translations?: T[]
}
export default function useGetContentTranslation(
  lg: any,
  locale?: Locale,
): any {
  const matched = lg?.translations?.find(
    (t: any) =>
      languageMap[t.language] === locale ||
      languageMap[t.language._id] === locale,
  )

  return matched || lg?.translations[0]
}
