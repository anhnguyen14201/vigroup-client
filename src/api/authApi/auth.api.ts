import { IData, ILoginForm, IRegisterForm } from '@/interface'
import axios from '../config/axios'

export const apiRegister = (data: IRegisterForm) =>
  axios({
    url: '/auth/register',
    method: 'post',
    data,
  })

export const apiLogin = (data: ILoginForm) =>
  axios({
    url: '/auth/login',
    method: 'post',
    data,
  })

export const apiLogout = () =>
  axios({
    url: '/auth/logout',
    method: 'get',
  })

export const apiGetAuthStatus = () =>
  axios({
    url: '/auth/status',
    method: 'get',
  })

export const apiRefreshToken = () =>
  axios({
    url: '/auth/refresh',
    method: 'post',
  })

export const apiForgotPassword = (data: any) =>
  axios({
    url: '/auth/forgotpassword',
    method: 'post',
    data,
  })

export const apiResetPassword = (data: any) =>
  axios({
    url: '/auth/resetpassword',
    method: 'put',
    data,
  })

export const apiFBLogin = (data: IData) =>
  axios({
    url: '/auth/facebook-auth',
    method: 'post',
    data,
  })
