import axios from 'axios';

import { env } from '../config/env';

export const AUTH_TOKEN_KEY = 'mealmind_access_token';
export const AUTH_USER_KEY = 'mealmind_user';

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token !== null) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      window.dispatchEvent(new Event('mealmind:unauthorized'));
    }
    return Promise.reject(error instanceof Error ? error : new Error('Request failed'));
  },
);
