import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateAttendance = (data: IData) =>
  axios({
    url: '/attendance',
    method: 'post',
    data,
  })

export const apiGetAllAttendance = (params: IData) =>
  axios({
    url: '/attendance',
    method: 'get',
    params,
  })

export const apiGetAttendanceByProjectAndEmployees = (
  projectId: string,
  employeeIds: string[],
) =>
  axios({
    url: '/attendance/by-project',
    method: 'get',
    params: {
      projectId: projectId,
      employeeIds: employeeIds.join(','),
    },
  })

export const apiGetMonthlySummary = (params: IData) =>
  axios({
    url: '/attendance/my-monthly-summary',
    method: 'get',
    params,
  })

export const apiGetAttendanceByDate = (params: IData) =>
  axios({
    url: '/attendance/',
    method: 'get',
    params,
  })
export const apiGetAttendanceByMonth = (params: IData) =>
  axios({
    url: '/attendance/attendance-by-month/',
    method: 'get',
    params,
  })

export const apiUpdateAttendanceByDate = (data: IData, _id: string) =>
  axios({
    url: '/attendance/' + _id,
    method: 'put',
    data,
  })

export const apiGetSummary = (params: IData) =>
  axios({
    url: '/attendance/monthly-summary',
    method: 'get',
    params,
  })

export const apiGetAttendanceDetail = (_id: string) =>
  axios({
    url: '/attendance/' + _id,
    method: 'get',
  })

export const apiUpdateAttendance = (data: IData, _id: string) =>
  axios({
    url: '/attendance/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteEmployee = (_id: string) =>
  axios({
    url: '/attendance/' + _id,
    method: 'delete',
  })
