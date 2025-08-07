import { IData } from '@/interface'
import axios from '../config/axios'

export const apiCreateProject = (data: IData) =>
  axios({
    url: '/project',
    method: 'post',
    data,
  })

export const apiAddCustomer = (data: IData) =>
  axios({
    url: 'project/add-customer-user',
    method: 'post',
    data,
  })

export const apiGetAllProjects = (params: IData) =>
  axios({
    url: '/project/private',
    method: 'get',
    params,
  })

export const apiGetAllPublicProjects = (params: IData) =>
  axios({
    url: '/project/projects',
    method: 'get',
    params,
  })

export const apiGetAllProjectsByUser = (params: IData) =>
  axios({
    url: '/project/projects-by-user',
    method: 'get',
    params,
  })

export const apiGetAllProjectsByEmmployee = () =>
  axios({
    url: '/project/projects-by-employee',
    method: 'get',
  })

export const apiGetProjectById = (_id: string) =>
  axios({
    url: '/project/' + _id,
    method: 'get',
  })
export const apiGetProjectBySlug = (slug: string) =>
  axios({
    url: '/project/slug/' + slug,
    method: 'get',
  })

export const apiUpdateProject = (data: IData, _id: string) =>
  axios({
    url: '/project/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteProject = (_id: string) =>
  axios({
    url: '/project/' + _id,
    method: 'delete',
  })

export const apiDeleteUserInProject = (id: string, _id: string) =>
  axios({
    url: '/project/' + id + '/customers/' + _id,
    method: 'delete',
  })

export const apiUpdateProjectStatus = (id: string, data: IData) =>
  axios({
    url: '/project/' + id + '/status',
    method: 'put',
    data,
  })

export const apiCreateDeposit = (id: string, data: IData) =>
  axios({
    url: '/project/' + id + '/deposit',
    method: 'post',
    data,
  })

export const apiDeleteDeposit = (id: string) =>
  axios({
    url: '/project/' + id + '/deposit/',
    method: 'delete',
  })

export const apiCreatePayment = (id: string, data: IData) =>
  axios({
    url: '/project/' + id + '/payment',
    method: 'post',
    data,
  })

export const apiDeletePayment = (id: string, data: IData) =>
  axios({
    url: '/project/' + id + '/payment',
    method: 'delete',
    data,
  })

export const apiCreateProjectType = (data: IData) =>
  axios({
    url: '/project-type',
    method: 'post',
    data,
  })

export const apiGetAllProjectTypes = () =>
  axios({
    url: '/project-type',
    method: 'get',
  })

export const apiUpdateProjectType = (data: IData, _id: string) =>
  axios({
    url: '/project-type/' + _id,
    method: 'put',
    data,
  })

export const apiDeleteProjectType = (_id: string) =>
  axios({
    url: '/project-type/' + _id,
    method: 'delete',
  })
