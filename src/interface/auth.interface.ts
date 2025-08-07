export interface ILoginForm {
  username: string
  email?: string
  password: string
  accessToken?: string
  refreshToken?: string
  user: object
}

export interface IRegisterForm {
  _id: string
  username: string
  password: string
  fullName: string
  country?: string
  street?: string
  province?: string
  postalCode?: string
  email?: string
  phone?: string
  position: string
  required?: boolean
  role: 3515 | 1413914 | 1311417518 | 5131612152555 | 32119201513518
  confirmPassword: string
  accessToken?: string
  isBlock?: boolean
  refreshToken?: string
  user: object
  requiredMessage?: string | undefined
  companyName?: string
  ico?: string
  dic?: string
  hourlyRate?: number
}

export interface IForgotPassword {
  email: string
}

export interface IResetPassword {
  password: string
  token: string
}
