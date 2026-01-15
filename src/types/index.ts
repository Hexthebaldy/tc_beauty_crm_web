export interface User {
  id: number
  phone: string
  role: 'admin' | 'manager' | 'staff'
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresAt: string
}

export interface Customer {
  id: number
  name: string
  phone: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  source?: string
  tags?: string[]
  preferredStoreId?: number
  ownerEmployeeId?: number
  status?: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Fulfillment {
  id: number
  customerId: number
  storeId: number
  employeeId?: number
  amount: number
  currency: string
  status: 'ordered' | 'fulfilled' | 'refunded'
  channel?: string
  note?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
  customer?: Customer
  store?: Store
  employee?: Employee
}

export interface Store {
  id: number
  code: string
  name: string
  status: 'active' | 'inactive'
  city: string
}

export interface Employee {
  id: number
  name: string
  title?: string
  status: 'active' | 'inactive'
  storeId: number
}

export interface ApiResponse<T> {
  data: T
}

export interface ListParams {
  limit?: number
  offset?: number
}

export interface CustomerListParams extends ListParams {
  storeId?: number
  ownerEmployeeId?: number
  q?: string
}

export interface FulfillmentListParams extends ListParams {
  storeId?: number
  employeeId?: number
  customerId?: number
  status?: 'ordered' | 'fulfilled' | 'refunded'
}
