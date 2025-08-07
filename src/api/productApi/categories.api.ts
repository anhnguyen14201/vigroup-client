import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateProductCategory = (data: IData) =>
  axios({
    url: '/category',
    method: 'post',
    data,
  })

export const apiGetAllProductCategories = () =>
  axios({
    url: '/category',
    method: 'get',
  })

export const apiUpdateProductCategory = (data: IData, _id: string) =>
  axios({
    url: '/category/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteProductCategory = (_id: string) =>
  axios({
    url: '/category/' + _id,
    method: 'delete',
  })
