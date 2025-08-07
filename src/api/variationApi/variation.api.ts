import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateVariation = (data: IData) =>
  axios({
    url: '/variation',
    method: 'post',
    data,
  })

export const apiGetAllVariations = (data: IData) =>
  axios({
    url: '/variation',
    method: 'get',
    data,
  })

export const apiUpdateVariation = (data: IData, _id: string) =>
  axios({
    url: '/variation/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteVariation = (_id: string) =>
  axios({
    url: '/variation/' + _id,
    method: 'delete',
  })
