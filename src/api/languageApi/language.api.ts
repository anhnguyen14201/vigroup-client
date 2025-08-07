import axios from '../config/axios'

//* API lấy danh sách ngôn ngữ */
export const apiGetLanguage = () =>
  axios({
    url: '/language',
    method: 'get',
  })
