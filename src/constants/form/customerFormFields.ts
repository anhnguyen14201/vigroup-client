import { IRegisterForm, ISelectOption } from '@/interface'

export const customerFormFields: Array<{
  name: keyof IRegisterForm
  label: string | undefined
  type: 'text' | 'url' | 'select' | 'switch' | 'password'
  options?: ISelectOption[] | undefined
  placeholder?: string | undefined
  defaultValue?: any | undefined
  required?: boolean | undefined
  requiredMessage?: string | undefined
  pattern?: RegExp | undefined
  patternMessage?: string | undefined
}> = [
  {
    name: 'username',
    label: 'Tên đăng nhập',
    type: 'text',
    placeholder: 'Nhập email hoặc số điện thoại',
    defaultValue: '',
    requiredMessage: 'Tên đăng nhập là bắt buộc.',
    pattern: /^(?:\d{9,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/,
    patternMessage:
      'Username phải là số điện thoại có ít nhất 9 số hoặc định dạng email.',
    required: true,
  },
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
    name: 'password',
    label: 'Mật khẩu',
    type: 'password',
    placeholder: 'Nhập mật khẩu',
    defaultValue: '',
    required: true,
    requiredMessage: 'Mật khẩu là bắt buộc.',
  },
  {
    name: 'confirmPassword',
    label: 'Xác nhận mật khẩu',
    type: 'password',
    placeholder: 'Nhập xác nhận mật khẩu',
    defaultValue: '',
    required: true,
    requiredMessage: 'Xác nhận mật khẩu là bắt buộc.',
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
