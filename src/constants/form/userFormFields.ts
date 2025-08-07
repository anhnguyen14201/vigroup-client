import { IRegisterForm } from '@/interface'

export const userFormFields: Array<{
  name: keyof IRegisterForm
  label: string | undefined
  type: 'text' | 'url' | 'select' | 'switch' | 'password'
  options?: any[] | undefined
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
    required: true,
    pattern: /^(?:\d{9,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/,
    patternMessage:
      'Username phải là số điện thoại có ít nhất 9 số hoặc định dạng email.',
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
    pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
    patternMessage:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 số.',
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
    name: 'hourlyRate',
    label: 'Lương theo giờ',
    type: 'text',
    placeholder: 'Nhập vào lương theo giờ',
    defaultValue: '',
    required: false,
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
    name: 'role',
    label: 'Vai trò',
    type: 'select',
    options: [
      { value: 1413914, label: 'Admin' },
      { value: 1311417518, label: 'Quản lý' },
      { value: 5131612152555, label: 'Nhân viên' },
    ],
    defaultValue: 5131612152555,
    required: true,
  },
]
