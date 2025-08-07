import { IRegisterForm, IUser } from '@/interface'

export const mapEmployeeToRegisterForm = (user: IUser): IRegisterForm => {
  return {
    _id: user.employeeId,
    phone: user.phone,
    hourlyRate: user.hourlyRate,
    password: user.password,
    fullName: user.fullName,
    street: user.street,
    email: user.email,
    position: user.position,
    role: user.role as IRegisterForm['role'], // Assuming the numeric value is valid
    confirmPassword: '', // Use empty string as default in edit mode
    isBlock: user.isBlock,
    user: {}, // Provide a default empty object for the required 'user' property
    username: user.username || '', // Add username with a default empty string if undefined
  }
}
