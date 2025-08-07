import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateInstallation = (data: IData) =>
  axios({
    url: '/installation',
    method: 'post',
    data,
  })

export const apiGetInstallation = () =>
  axios({
    url: '/installation',
    method: 'get',
  })

export const apiDeleteInstallation = (_id: IData) =>
  axios({
    url: '/installation/' + _id,
    method: 'delete',
  })

export const apiUpdateInstallation = (data: IData, _id: string) =>
  axios({
    url: '/installation/' + _id,
    method: 'put',
    data,
  })
