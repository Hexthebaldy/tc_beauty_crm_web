import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import { DashboardData } from '@/types'
import { StatCard } from '@/components/dashboard/StatCard'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import { RecentCustomers } from '@/components/dashboard/RecentCustomers'
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<7 | 30 | 'custom'>(7)
  const [customRange, setCustomRange] = useState<{ startDate: string; endDate: string } | undefined>()
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async (params?: { range?: 7 | 30; startDate?: string; endDate?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await dashboardApi.get(params || { range: range === 'custom' ? undefined : range })
      setData(response.data.data)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('加载数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard({ range: 7 })
  }, [])

  const handleRangeChange = (newRange: 7 | 30) => {
    setRange(newRange)
    setCustomRange(undefined)
    fetchDashboard({ range: newRange })
  }

  const handleCustomRangeChange = (startDate: string, endDate: string) => {
    setRange('custom')
    setCustomRange({ startDate, endDate })
    fetchDashboard({ startDate, endDate })
  }

  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
          <p className="text-muted-foreground mt-2">数据统计和分析面板</p>
        </div>
        <div className="rounded-lg border bg-card p-8 text-center text-destructive">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground mt-2">数据统计和分析面板</p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="今日成交金额"
          value={data ? formatAmount(data.today.totalAmount) : '-'}
          icon={DollarSign}
          description="已支付且未退款订单"
        />
        <StatCard
          title="今日成交单数"
          value={data ? data.today.orderCount : '-'}
          icon={ShoppingCart}
          description="已支付订单数量"
        />
        <StatCard
          title="今日客单价"
          value={data ? formatAmount(data.today.averageAmount) : '-'}
          icon={TrendingUp}
          description="平均每单金额"
        />
      </div>

      {/* Trend Chart */}
      {data && (
        <TrendChart
          data={data.trends.days}
          range={range}
          onRangeChange={handleRangeChange}
          onCustomRangeChange={handleCustomRangeChange}
          customRange={customRange}
          loading={loading}
        />
      )}

      {/* Recent Orders and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={data?.recentOrders || []} loading={loading} />
        <RecentCustomers customers={data?.recentCustomers || []} loading={loading} />
      </div>
    </div>
  )
}
