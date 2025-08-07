import { IRegisterForm } from '@/interface'

export const customerFormEditFields: Array<{
  name: keyof IRegisterForm
  label: string | undefined
  type: 'text' | 'url' | 'select' | 'switch' | 'password' | 'country' | 'phone'
  options?: any[] | undefined
  placeholder?: string | undefined
  defaultValue?: any | undefined
  required?: boolean | undefined
  requiredMessage?: string | undefined
}> = [
  {
    name: 'fullName',
    label: 'Họ & Tên',
    type: 'text',
    placeholder: 'Nhập họ và tên',
    defaultValue: '',
    required: true,
    requiredMessage: 'Họ & Tên là bắt buộc.',
  },

  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    placeholder: 'Nhập số điện thoại',
    defaultValue: '',
  },

  {
    name: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Nhập email',
    defaultValue: '',
  },

  {
    name: 'street',
    label: 'Địa chỉ và số nhà',
    type: 'text',
    placeholder: 'Nhập địa chỉ và số nhà',
    defaultValue: '',
  },
  {
    name: 'province',
    label: 'Tỉnh, thành phố',
    type: 'text',
    placeholder: 'Nhập tỉnh, thành phố',
    defaultValue: '',
  },

  {
    name: 'postalCode',
    label: 'Mã bưu chính',
    type: 'text',
    placeholder: 'Nhập mã bưu chính',
    defaultValue: '',
  },

  {
    name: 'ico',
    label: 'IČO',
    type: 'text',
    placeholder: 'Nhập họ vào IČO',
    defaultValue: '',
  },
  {
    name: 'companyName',
    label: 'Tên công ty',
    type: 'text',
    placeholder: 'Nhập tên công ty',
    defaultValue: '',
  },
  {
    name: 'dic',
    label: 'DIČ',
    type: 'text',
    placeholder: 'Nhập họ và0 IČO',
    defaultValue: '',
  },

  {
    name: 'isBlock',
    label: 'Đã khoá?',
    type: 'switch',
    defaultValue: false,
  },
]
