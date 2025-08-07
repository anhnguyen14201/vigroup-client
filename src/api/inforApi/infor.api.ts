import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateInfor = (data: IData) =>
  axios({
    url: '/infor',
    method: 'post',
    data,
  })

export const apiGetInfor = () =>
  axios({
    url: '/infor',
    method: 'get',
  })
export const apiGetPrivateInfor = () =>
  axios({
    url: '/infor/private-infor',
    method: 'get',
  })

export const apiGetPublicInfor = () =>
  axios({
    url: '/infor',
    method: 'get',
  })

export const apiDeleteInfor = (_id: string) =>
  axios({
    url: '/infor/' + _id,
    method: 'delete',
  })

export const apiUpdateInfor = (data: IData, _id: string) =>
  axios({
    url: '/infor/' + _id,
    method: 'put',
    data,
  })
