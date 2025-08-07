import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateQuote = (data: IData) =>
  axios({
    url: '/quote',
    method: 'post',
    data,
  })
export const apiCreateInvoice = (data: IData) =>
  axios({
    url: '/quote/invoice',
    method: 'post',
    data,
  })

export const apiGetAllQuotes = (params: IData) =>
  axios({
    url: '/quote',
    method: 'get',
    params,
  })

export const apiUpdateQuote = (data: IData, _id: string) =>
  axios({
    url: '/quote/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteQuote = (_id: string) =>
  axios({
    url: '/quote/' + _id,
    method: 'delete',
  })
