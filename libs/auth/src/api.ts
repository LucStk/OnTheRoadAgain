import axios from 'axios';
import type { AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
});

