import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateSlide = (data: IData) =>
  axios({
    url: '/slide',
    method: 'post',
    data,
  })

export const apiGetSlidePrivate = () =>
  axios({
    url: '/slide',
    method: 'get',
  })

export const apiGetSlidePublic = () =>
  axios({
    url: '/slide/slides',
    method: 'get',
  })

export const apiUpdateSlideOrder = (data: IData) =>
  axios({
    url: '/slide/order',
    method: 'put',
    data,
  })

export const apiUpdateSlide = (data: IData, _id: string) =>
  axios({
    url: '/slide/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteSlide = (_id: string) =>
  axios({
    url: '/slide/' + _id,
    method: 'delete',
  })
