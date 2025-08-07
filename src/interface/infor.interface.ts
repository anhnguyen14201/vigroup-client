export interface IInfor {
  _id: string
  inforType: string
  title: string
  desc: string
  url: string
  activity: true | false
  createdAt: string
  updatedAt: string
}

// Định nghĩa enum cho các kiểu logo
export enum IInforType {
  phone = 'phone',
  email = 'email',
  address = 'address',
  facebook = 'facebook',
  instagram = 'instagram',
  youtube = 'youtube',
  twitter = 'twitter',
  tiktok = 'tiktok',
  linkedIn = 'linkedIn',
}

// Cập nhật interface FormValues để bao gồm logoType
export interface IFormInforValues {
  activity: boolean
  url: string
  desc: string
  inforType: IInforType
}

export interface IInforListItem {
  infor: IInfor
  index: number
  onEdit: (s: IInfor) => void
  onDelete: (s: IInfor) => void
}

export interface IInforFormProps {
  infor?: IInfor | null
  setOpenAddInfor?: (open: boolean) => void
  onSuccess?: () => void
}
