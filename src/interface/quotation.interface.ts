export interface ISelectCurrencyOption {
  value: number | string
  label: number | string
}
export interface IQuotation {
  _id: string
  desc?: string
  quantity?: number
  cost?: number
  amount?: number
  currency?: string
  currencyPayment?: string
}

export interface IQuotationProps {
  id: string // id của item hoặc báo giá hiện hành
  quotationType: 'quotation' | 'variation' // chỉ định loại báo giá
  selectedQuotation: IQuotation | null // báo giá đã chọn, có thể null nếu chưa chọn
  // Hàm setSelectedQuotation nhận vào một IQuotation hoặc null
  setSelectedQuotation: (quotation: IQuotation | null) => void
  quotes: IQuotation[] // mảng danh sách báo giá
  isModalOpen: boolean // trạng thái mở của modal
  // Hàm setModalOpen để thay đổi trạng thái modal (mở/đóng)
  setModalOpen: (isOpen: boolean) => void
  modalType: 'add' | 'edit' | string // kiểu modal (ví dụ: 'add' để thêm, 'edit' để sửa; có thể mở rộng với string nếu cần)
  // Hàm xử lý khi chỉnh sửa báo giá, nhận vào báo giá cần chỉnh sửa
  handleEditQuotation: (quotation: IQuotation) => void
  // Hàm xử lý khi thêm báo giá, không cần tham số, hoặc có thể thêm nếu cần
  handleAddQuotation: () => void
  editQuotation: string
  createQuotation?: string
  labelQuotation?: string
}
