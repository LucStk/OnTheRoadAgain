import axios from 'axios';
import type { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const BACKEND_API_URL = "http://localhost:8000/api" 
const BACKEND_MEDIA_URL = "http://localhost:8000" 

const api: AxiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
  withCredentials: true
});
import { requestInterceptor, refreshInterceptor } from './interceptors'

api.interceptors.request.use(requestInterceptor)
createAuthRefreshInterceptor(api, refreshInterceptor)



export { api, BACKEND_API_URL, BACKEND_MEDIA_URL }