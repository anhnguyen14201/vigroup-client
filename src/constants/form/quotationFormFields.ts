import { IQuotation, ISelectCurrencyOption } from '@/interface'

export const quotationFormFields: {
  name: keyof IQuotation
  type: 'text' | 'select' | 'number' | 'password' | 'textarea'
  label: string
  placeholder: string
  defaultValue: string | number
  requiredMessage: string
  options?: ISelectCurrencyOption[]
  required: boolean
}[] = [
  {
    name: 'desc',
    label: 'Nội dung',
    type: 'text',
    placeholder: 'Nhập nội dung',
    defaultValue: '',
    requiredMessage: 'Nội dung là bắt buộc',
    required: true,
  },
  {
    name: 'quantity',
    label: 'Số lượng',
    type: 'number', // Trường nhập số
    placeholder: '0',
    defaultValue: '', // Giá trị mặc định là số 0
    requiredMessage: 'Số lượng là bắt buộc',
    required: true,
  },
  {
    name: 'cost',
    label: 'Giá thành',
    type: 'number', // Trường nhập số
    placeholder: '0',
    defaultValue: '', // Giá trị mặc định là số 0
    requiredMessage: 'Giá thành là bắt buộc',
    required: true,
  },
  {
    name: 'currency',
    label: 'Tiền tệ',
    type: 'select',
    placeholder: 'Chọn tiền tệ',
    requiredMessage: 'Tiền tệ là bắt buộc',
    options: [
      { value: 203, label: 'CZK' },
      { value: 840, label: 'USD' },
      { value: 978, label: 'EUR' },
    ],
    defaultValue: 203,
    required: true,
  },
]
