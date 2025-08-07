import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateQuotation = (data: IData) =>
  axios({
    url: '/quotation',
    method: 'post',
    data,
  })

export const apiGetAllQuotations = (params: IData) =>
  axios({
    url: '/quotation',
    method: 'get',
    params,
  })

export const apiUpdateQuotation = (data: IData, _id: string) =>
  axios({
    url: '/quotation/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteQuotation = (_id: string) =>
  axios({
    url: '/quotation/' + _id,
    method: 'delete',
  })
