import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fulfillmentsApi, customersApi, dictionaryApi } from '@/lib/api'
import { Fulfillment } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Pencil } from 'lucide-react'
import { format } from 'date-fns'

export default function FulfillmentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFulfillment, setEditingFulfillment] = useState<Fulfillment | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch fulfillments
  const { data: fulfillmentsData, isLoading } = useQuery({
    queryKey: ['fulfillments', statusFilter],
    queryFn: async () => {
      const response = await fulfillmentsApi.list({
        status: statusFilter || undefined,
      } as any)
      return response.data.data
    },
  })

  // Fetch customers, stores, and employees for dropdowns
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await customersApi.list()
      return response.data.data
    },
  })

  const { data: storesData } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await dictionaryApi.stores()
      return response.data.data
    },
  })

  const { data: employeesData } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await dictionaryApi.employees()
      return response.data.data
    },
  })

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: Partial<Fulfillment>) => {
      if (editingFulfillment) {
        return await fulfillmentsApi.update(editingFulfillment.id, data)
      } else {
        return await fulfillmentsApi.create(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fulfillments'] })
      setIsDialogOpen(false)
      setEditingFulfillment(null)
      toast({
        title: editingFulfillment ? '更新成功' : '创建成功',
        description: `履约记录${editingFulfillment ? '更新' : '创建'}成功`,
      })
    },
    onError: (error: any) => {
      toast({
        title: '操作失败',
        description: error.response?.data?.message || '请重试',
        variant: 'destructive',
      })
    },
  })

  const handleEdit = (fulfillment: Fulfillment) => {
    setEditingFulfillment(fulfillment)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingFulfillment(null)
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      ordered: 'bg-blue-100 text-blue-800',
      fulfilled: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800',
    }
    const labels = {
      ordered: '已下单',
      fulfilled: '已履约',
      refunded: '已退款',
    }
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">履约记录</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          新增履约记录
        </Button>
      </div>

      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部状态</SelectItem>
            <SelectItem value="ordered">已下单</SelectItem>
            <SelectItem value="fulfilled">已履约</SelectItem>
            <SelectItem value="refunded">已退款</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>门店</TableHead>
              <TableHead>员工</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>渠道</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>支付时间</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : fulfillmentsData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              fulfillmentsData?.map((fulfillment) => (
                <TableRow key={fulfillment.id}>
                  <TableCell>{fulfillment.id}</TableCell>
                  <TableCell>
                    {fulfillment.customer?.name || `客户#${fulfillment.customerId}`}
                  </TableCell>
                  <TableCell>
                    {fulfillment.store?.name || `门店#${fulfillment.storeId}`}
                  </TableCell>
                  <TableCell>
                    {fulfillment.employee?.name || fulfillment.employeeId || '-'}
                  </TableCell>
                  <TableCell>
                    {fulfillment.currency} {fulfillment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{fulfillment.channel || '-'}</TableCell>
                  <TableCell>{getStatusBadge(fulfillment.status)}</TableCell>
                  <TableCell>
                    {fulfillment.paidAt
                      ? format(new Date(fulfillment.paidAt), 'yyyy-MM-dd HH:mm')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(fulfillment.createdAt), 'yyyy-MM-dd HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(fulfillment)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <FulfillmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        fulfillment={editingFulfillment}
        customers={customersData || []}
        stores={storesData || []}
        employees={employeesData || []}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  )
}

interface FulfillmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fulfillment: Fulfillment | null
  customers: any[]
  stores: any[]
  employees: any[]
  onSubmit: (data: Partial<Fulfillment>) => void
  isLoading: boolean
}

function FulfillmentDialog({
  open,
  onOpenChange,
  fulfillment,
  customers,
  stores,
  employees,
  onSubmit,
  isLoading,
}: FulfillmentDialogProps) {
  const [formData, setFormData] = useState<Partial<Fulfillment>>({
    customerId: undefined,
    storeId: undefined,
    employeeId: undefined,
    amount: 0,
    currency: 'CNY',
    status: 'ordered',
    channel: undefined,
    note: undefined,
    paidAt: undefined,
  })

  // Update form when fulfillment changes
  useState(() => {
    if (fulfillment) {
      setFormData({
        customerId: fulfillment.customerId,
        storeId: fulfillment.storeId,
        employeeId: fulfillment.employeeId,
        amount: fulfillment.amount,
        currency: fulfillment.currency,
        status: fulfillment.status,
        channel: fulfillment.channel,
        note: fulfillment.note,
        paidAt: fulfillment.paidAt,
      })
    } else {
      setFormData({
        customerId: undefined,
        storeId: undefined,
        employeeId: undefined,
        amount: 0,
        currency: 'CNY',
        status: 'ordered',
        channel: undefined,
        note: undefined,
        paidAt: undefined,
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Only send allowed fields for updates
    if (fulfillment) {
      const { status, note, channel, paidAt } = formData
      onSubmit({ status, note, channel, paidAt })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{fulfillment ? '编辑履约记录' : '新增履约记录'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {!fulfillment && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="customerId">客户 *</Label>
                  <Select
                    value={formData.customerId?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customerId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择客户" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeId">门店 *</Label>
                  <Select
                    value={formData.storeId?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, storeId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择门店" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">员工</Label>
                  <Select
                    value={formData.employeeId?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, employeeId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择员工" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">金额 *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordered">已下单</SelectItem>
                  <SelectItem value="fulfilled">已履约</SelectItem>
                  <SelectItem value="refunded">已退款</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">渠道</Label>
              <Input
                id="channel"
                value={formData.channel || ''}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                placeholder="如: 美团、大众点评等"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidAt">支付时间</Label>
              <Input
                id="paidAt"
                type="datetime-local"
                value={
                  formData.paidAt
                    ? new Date(formData.paidAt).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="note">备注</Label>
              <Input
                id="note"
                value={formData.note || ''}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '提交中...' : '提交'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
