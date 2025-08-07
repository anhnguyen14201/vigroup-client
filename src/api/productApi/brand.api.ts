import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateProductBrand = (data: IData) =>
  axios({
    url: '/brand',
    method: 'post',
    data,
  })

export const apiGetAllProductBrands = () =>
  axios({
    url: '/brand',
    method: 'get',
  })

export const apiUpdateProductBrand = (data: IData, _id: string) =>
  axios({
    url: '/brand/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteProductBrand = (_id: string) =>
  axios({
    url: '/brand/' + _id,
    method: 'delete',
  })
