import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreatePage = (data: IData) =>
  axios({
    url: '/page',
    method: 'post',
    data,
  })

export const apiUpdatePage = (data: IData, _id: any) =>
  axios({
    url: '/page/' + _id,
    method: 'put',
    data,
  })

export const apiGetPageBySlug = (params: string) =>
  axios({
    url: '/page/' + params,
    method: 'get',
  })
