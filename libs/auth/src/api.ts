import axios from 'axios';
import type { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true
});
import { requestInterceptor, refreshInterceptor } from './interceptors'

api.interceptors.request.use(requestInterceptor)
createAuthRefreshInterceptor(api, refreshInterceptor)



export { api }