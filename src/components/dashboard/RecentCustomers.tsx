import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { DashboardCustomer } from '@/types'
import { ChevronDown, ChevronUp, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentCustomersProps {
  customers: DashboardCustomer[]
  loading?: boolean
}

const genderMap = {
  male: '男',
  female: '女',
  other: '其他',
}

const statusMap = {
  active: { label: '活跃', className: 'bg-green-100 text-green-700' },
  inactive: { label: '不活跃', className: 'bg-gray-100 text-gray-700' },
}

export function RecentCustomers({ customers, loading }: RecentCustomersProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">新增客户</h3>
        <span className="text-sm text-muted-foreground ml-auto">最近10名</span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : customers.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无新增客户</div>
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => {
            const isExpanded = expandedId === customer.id
            const statusInfo = statusMap[customer.status]

            return (
              <div
                key={customer.id}
                className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(customer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{customer.name}</span>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            statusInfo.className
                          )}
                        >
                          {statusInfo.label}
                        </span>
                        {customer.tags && customer.tags.length > 0 && (
                          <div className="flex gap-1">
                            {customer.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customer.phone} · {formatDate(customer.createdAt)}
                      </div>
                    </div>
                    <div>
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
                        <span className="text-muted-foreground">客户ID：</span>
                        <span className="font-medium">#{customer.id}</span>
                      </div>
                      {customer.gender && (
                        <div>
                          <span className="text-muted-foreground">性别：</span>
                          <span>{genderMap[customer.gender]}</span>
                        </div>
                      )}
                      {customer.source && (
                        <div>
                          <span className="text-muted-foreground">来源：</span>
                          <span>{customer.source}</span>
                        </div>
                      )}
                      {customer.preferredStoreName && (
                        <div>
                          <span className="text-muted-foreground">首选门店：</span>
                          <span>{customer.preferredStoreName}</span>
                        </div>
                      )}
                      {customer.ownerEmployeeName && (
                        <div>
                          <span className="text-muted-foreground">归属员工：</span>
                          <span>{customer.ownerEmployeeName}</span>
                        </div>
                      )}
                    </div>
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
