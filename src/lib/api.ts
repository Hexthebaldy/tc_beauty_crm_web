import axios, { AxiosError } from 'axios'
import type {
  AuthResponse,
  Customer,
  Fulfillment,
  Store,
  StoreCreateInput,
  StoreUpdateInput,
  Employee,
  ApiResponse,
  CustomerListParams,
  FulfillmentListParams,
  DashboardData,
  DashboardParams,
} from '@/types'

// 同域优先：生产环境默认跟随当前站点，开发用 env 或 localhost:8079
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:8079' : window.location.origin)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 让浏览器自动携带 httpOnly Cookie
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
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

  // 验证当前会话是否有效（通过任意需要认证的接口）
  verifySession: () => api.get('/api/stores'),
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

// Stores
export const storesApi = {
  list: () => api.get<ApiResponse<Store[]>>('/api/stores'),

  create: (data: StoreCreateInput) =>
    api.post<ApiResponse<Store>>('/api/stores', data),

  update: (id: number, data: StoreUpdateInput) =>
    api.put<ApiResponse<Store>>(`/api/stores/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<Store>>(`/api/stores/${id}`),
}

// Dictionary
export const dictionaryApi = {
  stores: () => api.get<ApiResponse<Store[]>>('/api/stores'),
  employees: (storeId?: number) =>
    api.get<ApiResponse<Employee[]>>('/api/employees', {
      params: storeId ? { storeId } : undefined,
    }),
}

// Dashboard
export const dashboardApi = {
  get: (params?: DashboardParams) =>
    api.get<ApiResponse<DashboardData>>('/api/dashboard', { params }),
}

export default api
