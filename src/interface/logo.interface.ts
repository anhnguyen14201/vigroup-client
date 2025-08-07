export interface ILogo {
  _id: string
  imageUrls: string[]
  logoType: string
  logoTitle: string
  activity: true | false
  createdAt: string
  updatedAt: string
  translations: any[]
}

// Định nghĩa enum cho các kiểu logo
export enum LogoType {
  logoSmall = 'logoSmall',
  logoBlack = 'logoBlack',
  logoWhite = 'logoWhite',
}

// Cập nhật interface FormValues để bao gồm logoType
export interface FormLogoValues {
  activity: boolean
  logoType: LogoType
}

export interface ILogoListItem {
  logo: ILogo
  index: number
  onEdit: (s: ILogo) => void
  onDelete: (s: ILogo) => void
}

export interface LogoFormProps {
  logo?: ILogo | null
  setOpenAddLogo?: (open: boolean) => void
  onSuccess?: () => void
}
