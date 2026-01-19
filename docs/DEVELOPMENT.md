# 开发指南

## 开发环境设置

### 1. 克隆项目
```bash
git clone <repository-url>
cd tc_beauty_crm_web
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:8079
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问: http://localhost:5173

## 项目结构说明

```
src/
├── components/
│   ├── ui/                  # shadcn UI基础组件
│   │   ├── button.tsx       # 按钮组件
│   │   ├── input.tsx        # 输入框组件
│   │   ├── dialog.tsx       # 对话框组件
│   │   ├── select.tsx       # 选择器组件
│   │   ├── table.tsx        # 表格组件
│   │   ├── toast.tsx        # 消息提示组件
│   │   └── ...
│   └── Layout.tsx           # 主布局组件
│
├── hooks/
│   └── useAuth.ts           # 认证Hook
│
├── lib/
│   ├── api.ts               # API服务封装
│   └── utils.ts             # 工具函数
│
├── pages/
│   ├── LoginPage.tsx        # 登录页面
│   ├── CustomersPage.tsx    # 客户管理页面
│   └── FulfillmentsPage.tsx # 履约记录页面
│
├── types/
│   └── index.ts             # TypeScript类型定义
│
├── App.tsx                  # 应用路由
├── main.tsx                 # 应用入口
└── index.css                # 全局样式
```

## 添加新页面

### 1. 创建页面组件
在 `src/pages/` 目录下创建新页面组件：
```tsx
// src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

### 2. 添加路由
在 `src/App.tsx` 中添加路由：
```tsx
<Route path="new" element={<NewPage />} />
```

### 3. 添加导航
在 `src/components/Layout.tsx` 中添加导航链接。

## API服务开发

### 1. 定义类型
在 `src/types/index.ts` 中定义数据类型：
```typescript
export interface NewEntity {
  id: number
  name: string
  // ...
}
```

### 2. 添加API方法
在 `src/lib/api.ts` 中添加API方法：
```typescript
export const newApi = {
  list: () => api.get<ApiResponse<NewEntity[]>>('/api/new'),
  create: (data: Partial<NewEntity>) =>
    api.post<ApiResponse<NewEntity>>('/api/new', data),
  // ...
}
```

### 3. 在组件中使用
```tsx
import { useQuery } from '@tanstack/react-query'
import { newApi } from '@/lib/api'

function MyComponent() {
  const { data } = useQuery({
    queryKey: ['new'],
    queryFn: async () => {
      const response = await newApi.list()
      return response.data.data
    },
  })
  // ...
}
```

## 添加新的shadcn组件

如需添加更多shadcn/ui组件，可以手动创建或参考shadcn文档：
https://ui.shadcn.com/docs/components

## 样式开发

### Tailwind CSS
使用Tailwind工具类：
```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
  {/* content */}
</div>
```

### 自定义主题
在 `src/index.css` 中修改CSS变量：
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

## 表单处理

### 受控表单
```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
})

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // 处理提交
}

<Input
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
```

## 状态管理

### React Query
用于服务端状态管理：

#### 查询数据
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction,
})
```

#### 修改数据
```tsx
const mutation = useMutation({
  mutationFn: updateFunction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] })
  },
})
```

### Local Storage
用于本地持久化：
```typescript
localStorage.setItem('key', 'value')
const value = localStorage.getItem('key')
```

## 错误处理

### API错误
```typescript
try {
  await api.post('/endpoint', data)
} catch (error: any) {
  toast({
    title: '操作失败',
    description: error.response?.data?.message || '请重试',
    variant: 'destructive',
  })
}
```

### 边界情况
- 加载状态处理
- 空数据展示
- 错误状态展示
- 网络错误重试

## 代码规范

### TypeScript
- 为所有函数参数和返回值定义类型
- 使用interface定义对象类型
- 避免使用any类型

### React
- 使用函数组件和Hooks
- 组件名使用PascalCase
- 文件名与组件名保持一致

### 命名规范
- 组件: `PascalCase`
- 函数/变量: `camelCase`
- 常量: `UPPER_SNAKE_CASE`
- 文件: `PascalCase.tsx` 或 `kebab-case.ts`

## 构建和部署

### 开发构建
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

### 部署到生产环境
1. 构建生产版本
2. 将 `dist/` 目录部署到静态服务器
3. 配置Nginx或其他Web服务器

### 环境变量
生产环境需要配置正确的API地址：
```env
VITE_API_BASE_URL=https://api.production.com
```

## 调试技巧

### React DevTools
安装React DevTools浏览器扩展进行组件调试。

### React Query DevTools
在开发环境中查看查询状态：
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />
```

### 网络请求
使用浏览器DevTools的Network标签查看API请求。

## 常见问题

### CORS错误
确保后端API配置了正确的CORS策略。

### Token过期
系统会自动处理token过期，跳转到登录页。

### 样式不生效
检查Tailwind配置和CSS类名拼写。

## 相关链接

- [React文档](https://react.dev/)
- [TypeScript文档](https://www.typescriptlang.org/)
- [Vite文档](https://vitejs.dev/)
- [shadcn/ui文档](https://ui.shadcn.com/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [TanStack Query文档](https://tanstack.com/query)
