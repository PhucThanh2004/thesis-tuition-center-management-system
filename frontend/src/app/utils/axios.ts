import axios from 'axios'
import type { AxiosResponse } from 'axios'


const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

instance.interceptors.response.use(
   (res: AxiosResponse) => res.data,
  err => {
    if (err.response?.status === 401) {
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)


export default instance
