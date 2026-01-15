import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi, dictionaryApi } from '@/lib/api'
import { Customer } from '@/types'
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
import { Plus, Pencil, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch customers
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const response = await customersApi.list({ q: searchQuery || undefined })
      return response.data.data
    },
  })

  // Fetch stores and employees for dropdowns
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
    mutationFn: async (data: Partial<Customer>) => {
      if (editingCustomer) {
        return await customersApi.update(editingCustomer.id, data)
      } else {
        return await customersApi.create(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setIsDialogOpen(false)
      setEditingCustomer(null)
      toast({
        title: editingCustomer ? '更新成功' : '创建成功',
        description: `客户${editingCustomer ? '更新' : '创建'}成功`,
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

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCustomer(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">客户管理</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          新增客户
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索客户姓名或手机号..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>性别</TableHead>
              <TableHead>生日</TableHead>
              <TableHead>来源</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : customersData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              customersData?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.gender === 'male' ? '男' : customer.gender === 'female' ? '女' : '其他'}
                  </TableCell>
                  <TableCell>
                    {customer.birthday ? format(new Date(customer.birthday), 'yyyy-MM-dd') : '-'}
                  </TableCell>
                  <TableCell>{customer.source || '-'}</TableCell>
                  <TableCell>
                    <span className={customer.status === 'active' ? 'text-green-600' : 'text-gray-400'}>
                      {customer.status === 'active' ? '活跃' : '停用'}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(customer.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(customer)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={editingCustomer}
        stores={storesData || []}
        employees={employeesData || []}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  )
}

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  stores: any[]
  employees: any[]
  onSubmit: (data: Partial<Customer>) => void
  isLoading: boolean
}

function CustomerDialog({
  open,
  onOpenChange,
  customer,
  stores,
  employees,
  onSubmit,
  isLoading,
}: CustomerDialogProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    gender: undefined,
    birthday: undefined,
    source: undefined,
    preferredStoreId: undefined,
    ownerEmployeeId: undefined,
    status: 'active',
  })

  // Update form when customer changes
  useState(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        gender: customer.gender,
        birthday: customer.birthday,
        source: customer.source,
        preferredStoreId: customer.preferredStoreId,
        ownerEmployeeId: customer.ownerEmployeeId,
        status: customer.status,
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        gender: undefined,
        birthday: undefined,
        source: undefined,
        preferredStoreId: undefined,
        ownerEmployeeId: undefined,
        status: 'active',
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{customer ? '编辑客户' : '新增客户'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">手机号 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">性别</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">生日</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday || ''}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">来源</Label>
              <Input
                id="source"
                value={formData.source || ''}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
            </div>
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
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredStoreId">首选门店</Label>
              <Select
                value={formData.preferredStoreId?.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, preferredStoreId: parseInt(value) })
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
              <Label htmlFor="ownerEmployeeId">负责员工</Label>
              <Select
                value={formData.ownerEmployeeId?.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, ownerEmployeeId: parseInt(value) })
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
