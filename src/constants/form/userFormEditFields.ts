import { IRegisterForm } from '@/interface'

export const userFormEditFields: Array<{
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
    name: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Nhập email',
    defaultValue: '',
    requiredMessage: '',
    required: false,
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    placeholder: 'Nhập số điện thoại',
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
    name: 'position',
    label: 'Chức vụ',
    type: 'text',
    placeholder: 'Nhập chức vụ',
    defaultValue: '',
    required: false,
  },

  {
    name: 'hourlyRate',
    label: 'Lương theo giờ',
    type: 'text',
    placeholder: 'Nhập vào lương theo giờ',
    defaultValue: '',
    required: false,
  },

  {
    name: 'role',
    label: 'Vai trò',
    type: 'select',
    options: [
      { value: 1413914, label: 'Admin' },
      { value: 1311417518, label: 'Quản lý' },
      { value: 5131612152555, label: 'Nhân viên' },
      { value: 32119201513518, label: 'Khách hàng' },
    ],
    defaultValue: 32119201513518,
    required: true,
  },

  {
    name: 'isBlock',
    label: 'Đã khoá?',
    type: 'switch',
    defaultValue: false,
  },
]
