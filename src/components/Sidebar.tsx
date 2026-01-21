import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
    Users,
    Receipt,
    LogOut,
    LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navItems = [
        {
            title: '客户管理',
            icon: Users,
            href: '/customers'
        },
        {
            title: '履约记录',
            icon: Receipt,
            href: '/fulfillments'
        }
    ]

    return (
        <div className="flex h-screen w-[280px] flex-col bg-background border-r">
            {/* Header / User Profile Section */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                        TC
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">CRM</h2>
                        <p className="text-sm text-muted-foreground">{user?.phone || 'User'}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    <Link to="/dashboard">
                        <Button
                            variant={location.pathname === '/dashboard' ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 h-12 font-normal",
                                location.pathname === '/dashboard'
                                    ? "bg-primary/5 text-primary hover:bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="text-base">仪表盘</span>
                        </Button>
                    </Link>

                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.href)
                        return (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 h-12 font-normal",
                                        isActive ? "bg-primary/5 text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="text-base">{item.title}</span>
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Footer / Logout */}
            <div className="mt-auto p-6 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    <span className="text-base">退出登录</span>
                </Button>
            </div>
        </div>
    )
}
