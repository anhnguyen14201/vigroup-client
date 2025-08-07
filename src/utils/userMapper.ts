import { IRegisterForm, IUser } from '@/interface'

export const mapUserToRegisterForm = (user: IUser): IRegisterForm => ({
  _id: user.employeeId,
  phone: user.phone,
  password: user.password,
  fullName: user.fullName,
  street: user.street,
  province: user.province,
  country: user.country,
  postalCode: user.postalCode,
  email: user.email,
  position: user.position,
  role: user.role as IRegisterForm['role'],
  confirmPassword: '', // Mặc định rỗng trong chế độ edit
  isBlock: user.isBlock,
  user: {}, // Mặc định là object rỗng nếu cần thiết
  username: user.username || '',
  companyName: user.companyName,
  ico: user.ico,
  dic: user.dic,
})
