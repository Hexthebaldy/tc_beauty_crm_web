import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Store, StoreCreateInput, StoreUpdateInput } from '@/types'
import { storesApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { Settings, Store as StoreIcon, Plus, Pencil, Trash2 } from 'lucide-react'
import { AxiosError } from 'axios'

export default function ConfigPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [deletingStore, setDeletingStore] = useState<Store | null>(null)
  const [formData, setFormData] = useState<StoreCreateInput>({
    code: '',
    name: '',
    city: '',
    address: '',
    status: 'open',
  })
  const { toast } = useToast()

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await storesApi.list()
      setStores(response.data.data)
    } catch (error) {
      console.error('Failed to fetch stores:', error)
      toast({
        title: '加载失败',
        description: '获取门店列表失败，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      city: '',
      address: '',
      status: 'open',
    })
    setEditingStore(null)
  }

  const handleOpenDialog = (store?: Store) => {
    if (store) {
      setEditingStore(store)
      setFormData({
        code: store.code,
        name: store.name,
        city: store.city || '',
        address: store.address || '',
        status: store.status,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.code.trim() || !formData.name.trim()) {
      toast({
        title: '验证失败',
        description: '门店编码和名称为必填项',
        variant: 'destructive',
      })
      return
    }

    if (formData.code.length > 30) {
      toast({
        title: '验证失败',
        description: '门店编码不能超过30个字符',
        variant: 'destructive',
      })
      return
    }

    if (formData.name.length > 120) {
      toast({
        title: '验证失败',
        description: '门店名称不能超过120个字符',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      if (editingStore) {
        // Update
        const updateData: StoreUpdateInput = {}
        if (formData.code !== editingStore.code) updateData.code = formData.code
        if (formData.name !== editingStore.name) updateData.name = formData.name
        if (formData.city !== (editingStore.city || '')) updateData.city = formData.city || undefined
        if (formData.address !== (editingStore.address || '')) updateData.address = formData.address || undefined
        if (formData.status !== editingStore.status) updateData.status = formData.status

        await storesApi.update(editingStore.id, updateData)
        toast({
          title: '更新成功',
          description: `门店 "${formData.name}" 已更新`,
        })
      } else {
        // Create
        await storesApi.create(formData)
        toast({
          title: '创建成功',
          description: `门店 "${formData.name}" 已创建`,
        })
      }
      handleCloseDialog()
      fetchStores()
    } catch (error) {
      console.error('Failed to save store:', error)
      const axiosError = error as AxiosError<{ message?: string }>
      if (axiosError.response?.status === 409) {
        toast({
          title: '保存失败',
          description: '门店编码已存在，请使用其他编码',
          variant: 'destructive',
        })
      } else {
        toast({
          title: '保存失败',
          description: axiosError.response?.data?.message || '请稍后重试',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDeleteDialog = (store: Store) => {
    setDeletingStore(store)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setDeletingStore(null)
  }

  const handleConfirmDelete = async () => {
    if (!deletingStore) return

    try {
      setLoading(true)
      await storesApi.delete(deletingStore.id)
      toast({
        title: '删除成功',
        description: `门店 "${deletingStore.name}" 已删除`,
      })
      handleCloseDeleteDialog()
      fetchStores()
    } catch (error) {
      console.error('Failed to delete store:', error)
      const axiosError = error as AxiosError<{ message?: string }>
      if (axiosError.response?.status === 400) {
        toast({
          title: '删除失败',
          description: '该门店存在关联数据（如员工或履约记录），无法删除',
          variant: 'destructive',
        })
      } else if (axiosError.response?.status === 404) {
        toast({
          title: '删除失败',
          description: '门店不存在',
          variant: 'destructive',
        })
      } else {
        toast({
          title: '删除失败',
          description: axiosError.response?.data?.message || '请稍后重试',
          variant: 'destructive',
        })
      }
      handleCloseDeleteDialog()
    } finally {
      setLoading(false)
    }
  }

  const statusLabels = {
    open: '营业中',
    closed: '已关闭',
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">配置管理</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <StoreIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">门店管理</h2>
          </div>
          <Button onClick={() => handleOpenDialog()} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            新建门店
          </Button>
        </div>

        {loading && stores.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">加载中...</div>
        ) : stores.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">暂无门店数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">编码</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">名称</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">城市</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">地址</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">状态</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-4 font-mono text-sm">{store.code}</td>
                    <td className="py-3 px-4 font-medium">{store.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{store.city || '-'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{store.address || '-'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          store.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusLabels[store.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(store)}
                          disabled={loading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(store)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStore ? '编辑门店' : '新建门店'}</DialogTitle>
            <DialogDescription>
              {editingStore ? '修改门店信息' : '填写门店基本信息'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  门店编码 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="例如：BJ001"
                  maxLength={30}
                  required
                />
                <p className="text-xs text-muted-foreground">最多30个字符</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">
                  门店名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：北京国贸店"
                  maxLength={120}
                  required
                />
                <p className="text-xs text-muted-foreground">最多120个字符</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">城市</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="例如：北京"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">地址</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="例如：朝阳区建国门外大街1号"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'open' | 'closed') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">营业中</SelectItem>
                    <SelectItem value="closed">已关闭</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : editingStore ? '保存' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              此操作不可恢复，请谨慎操作。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-foreground">
              确定要删除门店 <span className="font-semibold">"{deletingStore?.name}"</span> 吗？
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              门店编码：{deletingStore?.code}
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDeleteDialog}>
              取消
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
