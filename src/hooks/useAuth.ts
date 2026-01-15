import { useState, useEffect } from 'react'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        logout()
      }
    }
  }, [])

  const login = (user: User, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return { user, isAuthenticated, login, logout }
}
