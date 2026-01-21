import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { DashboardOrder } from '@/types'
import { ChevronDown, ChevronUp, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentOrdersProps {
  orders: DashboardOrder[]
  loading?: boolean
}

const statusMap = {
  ordered: { label: '已下单', className: 'bg-blue-100 text-blue-700' },
  fulfilled: { label: '已完成', className: 'bg-green-100 text-green-700' },
  refunded: { label: '已退款', className: 'bg-red-100 text-red-700' },
}

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAmount = (amount: string) => {
    return `¥${parseFloat(amount).toFixed(2)}`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">最近交易</h3>
        <span className="text-sm text-muted-foreground ml-auto">最近10单</span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无交易记录</div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id
            const statusInfo = statusMap[order.status]

            return (
              <div
                key={order.id}
                className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.customerName}</span>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            statusInfo.className
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.storeName} · {formatDate(order.paidAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">
                        {formatAmount(order.amount)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t bg-muted/30 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <span className="text-muted-foreground">订单号：</span>
                        <span className="font-medium">#{order.id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">客户电话：</span>
                        <span>{order.customerPhone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">服务员工：</span>
                        <span>{order.employeeName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">支付渠道：</span>
                        <span>{order.channel || '-'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">创建时间：</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">币种：</span>
                        <span>{order.currency}</span>
                      </div>
                    </div>
                    {order.note && (
                      <div className="pt-2">
                        <span className="text-muted-foreground">备注：</span>
                        <p className="mt-1 text-foreground">{order.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
