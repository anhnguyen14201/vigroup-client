import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateProgressProject = (data: IData) =>
  axios({
    url: '/progress',
    method: 'post',
    data,
  })

export const apiUpdateProgressProject = (data: IData, _id: string) =>
  axios({
    url: '/progress/' + _id,
    method: 'put',
    data,
  })
