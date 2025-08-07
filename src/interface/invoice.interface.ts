export interface InvoiceCustomer {
  companyName?: string
  fullName: string
}

export type WarrantyStatus = 'active' | 'expired'

export interface InvoiceWarranty {
  startDate: string
  endDate: string
  status: WarrantyStatus
}

export type InvoiceStatus = 'draft' | 'quote' | 'invoice'

export interface IInvoice {
  id: string
  code: string
  customer: InvoiceCustomer
  date: string // ISO string
  totalPrice: number
  warranty: InvoiceWarranty
  status: InvoiceStatus
}

export interface GetInvoiceColumnsProps {
  onEdit: (inv: IInvoice) => void
  onDelete: (inv: IInvoice) => void
  onShow: (inv: IInvoice) => void
}
