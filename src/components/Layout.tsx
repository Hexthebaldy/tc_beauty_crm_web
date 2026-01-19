import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Users, Receipt, LogOut } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">TC Beauty CRM系统</h1>
            <nav className="flex gap-4">
              <Link to="/customers">
                <Button variant="ghost" className="gap-2">
                  <Users className="h-4 w-4" />
                  客户管理
                </Button>
              </Link>
              <Link to="/fulfillments">
                <Button variant="ghost" className="gap-2">
                  <Receipt className="h-4 w-4" />
                  履约记录
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.phone} ({user?.role})
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6 px-4">
        <Outlet />
      </main>
    </div>
  )
}
