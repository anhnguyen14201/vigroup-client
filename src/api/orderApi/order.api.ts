import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateOrder = (data: IData) =>
  axios({
    url: '/order',
    method: 'post',
    data,
  })

export const apiGetAllOrders = (params: IData) =>
  axios({
    url: '/order/private',
    method: 'get',
    params,
  })

export const apiGetAllPublicOrders = (params: IData) =>
  axios({
    url: '/order/',
    method: 'get',
    params,
  })

export const apiGetOrderById = (_id: string) =>
  axios({
    url: '/order/' + _id,
    method: 'get',
  })

export const apiUpdateOrderStatus = (data: any) =>
  axios({
    url: '/order/status',
    method: 'put',
    data,
  })

export const apiUpdateOrderPdfUrl = (data: any, id: string) =>
  axios({
    url: '/order/' + id,
    method: 'put',
    data,
  })

export const apiDeleteOrder = (_id: string) =>
  axios({
    url: '/order/' + _id,
    method: 'delete',
  })

export const apiGetOrderStatisticsByDay = () =>
  axios({
    url: '/order/statistics/day',
    method: 'get',
  })
export const apiGetOrderStatisticsByWeek = () =>
  axios({
    url: '/order/statistics/week',
    method: 'get',
  })
export const apiGetOrderStatisticsByMonth = () =>
  axios({
    url: '/order/statistics/month',
    method: 'get',
  })

export const apiGetOrderStatisticsByYear = () =>
  axios({
    url: '/order/statistics/year',
    method: 'get',
  })
