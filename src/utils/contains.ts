import { IInforType, LogoType } from '@/interface'

export const logoOptions = [
  { value: LogoType.logoSmall, title: 'Logo nhỏ' },
  { value: LogoType.logoBlack, title: 'Logo dành cho nền trắng' },
  { value: LogoType.logoWhite, title: 'Logo dành cho nền đen' },
]

export const inforOptions = [
  { value: IInforType.phone, title: 'Số điện thoại' },
  { value: IInforType.email, title: 'Email' },
  { value: IInforType.address, title: 'Địa chỉ' },
  { value: IInforType.facebook, title: 'Facebook' },
  { value: IInforType.instagram, title: 'Instagram' },
  { value: IInforType.youtube, title: 'Youtube' },
  { value: IInforType.twitter, title: 'Twitter' },
  { value: IInforType.tiktok, title: 'Tiktok' },
  { value: IInforType.linkedIn, title: 'LinkedIn' },
]

type ProjectStatus = 'processing' | 'started' | 'finished' | 'cancelled'

export const ACTIONS: {
  key: ProjectStatus
  label: string
  color: 'green' | 'blue' | 'red'
  allowed: (status: ProjectStatus) => boolean
}[] = [
  {
    key: 'started',
    label: 'Bắt đầu dự án',
    color: 'green',
    allowed: status => status === 'processing',
  },
  {
    key: 'finished',
    label: 'Kết thúc dự án',
    color: 'blue',
    allowed: status => status === 'started',
  },
  {
    key: 'cancelled',
    label: 'Hủy dự án',
    color: 'red',
    allowed: status => status !== 'finished' && status !== 'cancelled',
  },
]
