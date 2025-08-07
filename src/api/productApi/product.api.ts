import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateProduct = (data: IData) =>
  axios({
    url: '/product',
    method: 'post',
    data,
  })

export const apiGetAllProducts = (params: IData) =>
  axios({
    url: '/product',
    method: 'get',
    params,
  })

export const apiGetProductsByIds = (ids: string[]) =>
  axios({
    url: '/product/products',
    method: 'get',
    params: {
      ids: ids.join(','), // Ví dụ: "abc123,def456,ghi789"
    },
  })

export const apiGetAllProductsPrivate = (params: IData) =>
  axios({
    url: '/product/private',
    method: 'get',
    params,
  })

export const apiGetProductBySlug = (slug: string) =>
  axios({
    url: '/product/' + slug,
    method: 'get',
  })
export const apiGetRelatedProductBySlug = (slug: string) =>
  axios({
    url: '/product/' + slug + '/related',
    method: 'get',
  })

export const apiUpdateProduct = (data: IData, _id: string) =>
  axios({
    url: '/product/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteProduct = (_id: string) =>
  axios({
    url: '/product/' + _id,
    method: 'delete',
  })
