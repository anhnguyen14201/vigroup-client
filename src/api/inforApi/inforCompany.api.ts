import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateInforCompany = (data: IData) =>
  axios({
    url: '/company',
    method: 'post',
    data,
  })

export const apiGetInforCompany = () =>
  axios({
    url: '/company',
    method: 'get',
  })

export const apiDeleteInforCompany = (_id: string) =>
  axios({
    url: '/company/' + _id,
    method: 'delete',
  })

export const apiUpdateInforCompany = (data: IData, _id: string) =>
  axios({
    url: '/company/' + _id,
    method: 'put',
    data,
  })
