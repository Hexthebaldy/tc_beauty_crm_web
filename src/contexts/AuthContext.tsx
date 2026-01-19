import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@/types'
import { authApi } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Token 在 HttpOnly Cookie 中，JS 无法读取
    // 需要验证 Cookie 是否有效
    const initAuth = async () => {
      const userStr = localStorage.getItem('user')

      if (userStr) {
        try {
          const userData = JSON.parse(userStr)

          // 验证 Cookie 中的 token 是否有效
          try {
            await authApi.verifySession()
            // Cookie 有效，恢复登录状态
            setUser(userData)
            setIsAuthenticated(true)
          } catch (error) {
            // Cookie 无效或过期，清除本地数据
            console.log('Session expired, please login again')
            localStorage.removeItem('user')
          }
        } catch (error) {
          console.error('Failed to parse user data:', error)
          localStorage.removeItem('user')
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (user: User) => {
    // Token 已经由后端设置到 HttpOnly Cookie 中
    // 前端只保存用户信息用于显示
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    // 清除本地用户信息
    // Cookie 由后端在登出接口中清除（或自然过期）
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  // 初始化时显示加载状态，避免闪烁
  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
