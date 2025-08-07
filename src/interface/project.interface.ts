export interface Translation {
  language: string // hoặc { code: string } tuỳ structure
  projectName: string
  description: string
  metaDescription: string
}

export interface IProject {
  _id?: string
  code?: string
  projectName?: string
  location?: string
  startDate?: string | null
  endDate?: string | null
  status?: string
  employees?: any[]
  customerUser: any[]
  dailyProgress?: any[]
  quotes?: any[]
  paymentStatus?: string
  depositAmount?: number
  totalReceived?: number
  totalPaidAmount?: number
  totalAmount?: number
  paymentAmounts?: any[]
  currencyPayment?: number
  totalQuotationAmount?: number
  totalVariationAmount?: number
  createdAt?: string
  updatedAt?: string
  additionalCost?: string | number
  timelineContent?: string
  currencyQuotes?: number
  currency?: number

  projectType?: string
  translations?: Translation[]
}

export interface IQuotationCard {
  onAddQuotation?: () => void
  columns?: any[]
  data?: any[]
  buttons?: {
    label: string
    onClick: () => void
  }[]
  /*   onDeleteSelected: (selectedUsers: any) => void
   */ setInputChange?: any
  inputChange?: any
  totalItems?: number
  totalPages?: number
  currentPage?: number
  showTitle: string
}
export interface IAdditionalCostCard {
  additionalCost?: number
  onAdditionalCost?: () => void
}

export interface ProjectFormValues {
  code: string
  location: string
  projectType: string
  thumbnail?: File
  images: File[]
  [key: string]: string | File | File[] | undefined
}
