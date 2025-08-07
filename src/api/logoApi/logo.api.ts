import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateLogo = (data: IData) =>
  axios({
    url: '/logo',
    method: 'post',
    data,
  })

export const apiGetPublicLogo = () =>
  axios({
    url: '/logo',
    method: 'get',
  })

export const apiGetPrivateLogo = () =>
  axios({
    url: '/logo/privateLogo',
    method: 'get',
  })

export const apiDeleteLogo = (_id: string) =>
  axios({
    url: '/logo/' + _id,
    method: 'delete',
  })

export const apiUpdateLogo = (data: IData, _id: string) =>
  axios({
    url: '/logo/' + _id,
    method: 'put',
    data,
  })
