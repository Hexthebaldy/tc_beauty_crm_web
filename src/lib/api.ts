import axios, { AxiosError } from 'axios'
import type {
  AuthResponse,
  Customer,
  Fulfillment,
  Store,
  Employee,
  ApiResponse,
  CustomerListParams,
  FulfillmentListParams,
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (phone: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { phone, password }),

  register: (phone: string, password: string, role?: string) =>
    api.post<AuthResponse>('/api/auth/register', { phone, password, role }),
}

// Customers
export const customersApi = {
  list: (params?: CustomerListParams) =>
    api.get<ApiResponse<Customer[]>>('/api/customers', { params }),

  create: (data: Partial<Customer>) =>
    api.post<ApiResponse<Customer>>('/api/customers', data),

  update: (id: number, data: Partial<Customer>) =>
    api.put<ApiResponse<Customer>>(`/api/customers/${id}`, data),
}

// Fulfillments
export const fulfillmentsApi = {
  list: (params?: FulfillmentListParams) =>
    api.get<ApiResponse<Fulfillment[]>>('/api/fulfillments', { params }),

  create: (data: Partial<Fulfillment>) =>
    api.post<ApiResponse<Fulfillment>>('/api/fulfillments', data),

  update: (id: number, data: Partial<Fulfillment>) =>
    api.put<ApiResponse<Fulfillment>>(`/api/fulfillments/${id}`, data),
}

// Dictionary
export const dictionaryApi = {
  stores: () => api.get<ApiResponse<Store[]>>('/api/stores'),
  employees: (storeId?: number) =>
    api.get<ApiResponse<Employee[]>>('/api/employees', {
      params: storeId ? { storeId } : undefined,
    }),
}

export default api
