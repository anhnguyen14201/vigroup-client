export interface ILogoProps {
  scrolled?: boolean
}
export interface IBannerProps {
  title: string
}

export interface IDataTableProps {
  columns?: any[]
  data?: any[]
  buttons?: {
    label: string
    onClick: () => void
  }[]
  onDeleteSelected?: (selectedUsers: any) => void
  setInputChange?: any
  inputChange?: any
  totalItems?: number
  totalPages?: number
  currentPage?: number
  showTitle?: string
  showSearch?: true | false
  showPagination?: true | false
  languages?: any
  setCurrentLang?: (lang: string) => void
  currentLang?: string
  pageParam?: string
  isLoading?: boolean
  remainingCount?: any
  loadMore?: any
  isLoadingMore?: any
}

export interface IData {
  [key: string]: any
}

export interface FormField {
  name: string
  label: string
  placeholder: string
  type: 'text' | 'textarea' | 'select' | 'number' // v.v.
}

export type Locale = 'vi' | 'en' | 'cs'
