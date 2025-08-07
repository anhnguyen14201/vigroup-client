export interface IUserCurrent {
  isLoginedIn: boolean
  current: any | null
  token: string | null
}

export interface IUser {
  _id: string
  employeeId: string
  fullName: string
  phone?: string
  email?: string
  street?: string
  province?: string
  country?: string
  postalCode?: string
  position: string
  role: number
  isBlock: boolean
  fetchUsers?: () => void // Added fetchUsers property
  username: string // hoặc một logic khác phù hợp với nghiệp vụ của bạn
  password: string
  confirmPassword: ''
  companyName?: string
  ico?: string
  dic?: string
  projects: any[]
  hourlyRate?: number
  totalSalary?: number
}

export interface IUserForm {
  fullName: string
  email: string
  address: string
  position: string
  role: number | string
  isBlock: boolean
}
