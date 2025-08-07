import { IData } from '@/interface'
import axios from '../config/axios'

export const apiGetCurrent = () =>
  axios({
    url: '/user/current',
    method: 'get',
  })

export const apiGetAllCustomers = (params: IData) =>
  axios({
    url: '/user/customers',
    method: 'get',
    params,
  })

export const apiGetUserById = (_id: string) =>
  axios({
    url: '/user/' + _id,
    method: 'get',
  })

export const apiGetNonCustomers = (params: IData) =>
  axios({
    url: '/user/non-customers',
    method: 'get',
    params,
  })

export const apiUpdateUser = (data: IData, _id: string) =>
  axios({
    url: '/user/' + _id,
    method: 'put',
    data,
  })

export const apiUpdateByUser = (data: IData, _id: string) =>
  axios({
    url: '/user/users/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteUser = (_id: string) =>
  axios({
    url: '/user/' + _id,
    method: 'delete',
  })
