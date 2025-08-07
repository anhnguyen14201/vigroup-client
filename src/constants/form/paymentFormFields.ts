import { IQuotation, ISelectCurrencyOption } from '@/interface'

export const paymentFormFields: {
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
    name: 'amount',
    label: 'Giá thành',
    type: 'number', // Trường nhập số
    placeholder: '0',
    defaultValue: '', // Giá trị mặc định là số 0
    requiredMessage: 'Giá thành là bắt buộc',
    required: true,
  },
  {
    name: 'currencyPayment',
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
