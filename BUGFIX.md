# Bug修复记录

## 问题描述
登录成功后，页面停留在登录页面不跳转，token也没有被存储到localStorage。

## 问题原因
每个组件独立调用 `useAuth()` hook，导致状态不共享：
- `LoginPage` 调用 `login()` 更新了自己的本地状态
- `PrivateRoute` 在 `App.tsx` 中也调用了 `useAuth()`，但它的状态是独立的
- 两个状态互不影响，导致路由守卫认为用户仍未登录

## 解决方案
使用 React Context 实现全局认证状态共享：

1. **创建 AuthContext** (`src/contexts/AuthContext.tsx`)
   - 使用 `createContext` 创建认证上下文
   - 使用 `AuthProvider` 组件包裹整个应用
   - 导出 `useAuth` hook 供其他组件使用

2. **更新 App.tsx**
   - 使用 `AuthProvider` 包裹路由
   - 确保所有组件共享同一个认证状态

3. **更新组件导入**
   - 将所有 `import { useAuth } from '@/hooks/useAuth'`
   - 改为 `import { useAuth } from '@/contexts/AuthContext'`

## 修改的文件
- ✅ 新增：`src/contexts/AuthContext.tsx`
- ✅ 修改：`src/App.tsx`
- ✅ 修改：`src/pages/LoginPage.tsx`
- ✅ 修改：`src/components/Layout.tsx`

## 测试验证
```bash
npm run build  # ✅ 构建成功
```

## 现在的工作流程
1. 用户在 `LoginPage` 登录
2. 调用 `login(user, token)`
3. `AuthContext` 更新全局状态：
   - 保存 token 到 localStorage
   - 保存 user 到 localStorage
   - 更新 `isAuthenticated` 为 true
4. `PrivateRoute` 检测到 `isAuthenticated` 变化
5. 允许访问受保护的路由
6. `navigate('/customers')` 成功跳转

## 如何测试
1. 重启开发服务器（如果正在运行）：
   ```bash
   npm run dev
   ```

2. 打开浏览器开发者工具的 Console 和 Network 标签

3. 访问 http://localhost:5173

4. 输入测试账号登录：
   - 手机号：13912447039
   - 密码：你的密码

5. 应该看到：
   - Network 中登录请求成功
   - Console 中没有错误
   - 页面自动跳转到客户管理页面
   - localStorage 中有 `token` 和 `user`

6. 验证 localStorage：
   ```javascript
   // 在浏览器 Console 中执行
   console.log(localStorage.getItem('token'))
   console.log(localStorage.getItem('user'))
   ```

## 注意事项
- 旧的 `src/hooks/useAuth.ts` 文件可以删除（已不使用）
- 刷新页面后登录状态会保持（从 localStorage 恢复）
- Token 过期后会自动跳转到登录页

---

## Bug #2: 履约记录页面白屏

### 问题描述
访问 `/fulfillments` 页面时白屏，控制台报错：
```
Uncaught Error: A <Select.Item /> must have a value prop that is not an empty string.
```

### 问题原因
在状态筛选器中，"全部状态" 选项的 value 设置为空字符串 `""`，而 Radix UI 的 Select 组件不允许 SelectItem 的 value 为空字符串。

### 解决方案
将空字符串改为有意义的值 `"all"`，并在值变化时进行转换：
- 显示时：空字符串 → `"all"`
- API请求时：`"all"` → 空字符串（undefined）

### 修改代码
```tsx
// 修改前
<Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectItem value="">全部状态</SelectItem>
  ...
</Select>

// 修改后
<Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
  <SelectItem value="all">全部状态</SelectItem>
  ...
</Select>
```

### 修改的文件
- ✅ 修改：`src/pages/FulfillmentsPage.tsx`

### 测试验证
```bash
npm run build  # ✅ 构建成功
```

访问 `/fulfillments` 页面正常显示。

---

## Bug #3: 新增履约记录后白屏，金额显示 NaN

### 问题描述
新增履约记录后页面白屏，控制台报错：
```
Warning: Received NaN for the `value` attribute
TypeError: fulfillment.amount.toFixed is not a function
```

### 问题原因
1. **错误使用 `useState` 代替 `useEffect`**：在对话框组件中使用 `useState(() => {...})` 来初始化表单，这是错误的语法
2. **金额输入处理不当**：`parseFloat('')` 会返回 `NaN`
3. **后端返回的 amount 可能是字符串**：需要转换为数字后才能调用 `toFixed()`

### 解决方案

#### 1. 修复表单初始化
使用 `useEffect` 监听对话框打开状态和履约记录变化：
```tsx
// 修改前（错误）
useState(() => {
  if (fulfillment) { ... }
})

// 修改后（正确）
useEffect(() => {
  if (open) {
    if (fulfillment) { ... }
  }
}, [open, fulfillment])
```

#### 2. 修复金额输入
处理空值情况，避免 NaN：
```tsx
// 修改前
value={formData.amount}
onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}

// 修改后
value={formData.amount || ''}
onChange={(e) => setFormData({ ...formData, amount: e.target.value ? parseFloat(e.target.value) : 0 })}
```

#### 3. 修复金额显示
确保 amount 转换为数字：
```tsx
// 修改前
{fulfillment.amount.toFixed(2)}

// 修改后
{Number(fulfillment.amount).toFixed(2)}
```

### 修改的文件
- ✅ 修改：`src/pages/FulfillmentsPage.tsx`
  - 添加 `useEffect` import
  - 修复表单初始化逻辑
  - 修复金额输入处理
  - 修复金额显示

### 测试验证
```bash
npm run build  # ✅ 构建成功
```

现在可以正常新增履约记录，金额显示正确。

---

修复时间: 2026-01-15

## Bug #4: 登录后被重定向回登录页，token 未保存

### 问题描述
用户登录成功后，页面跳转到受保护路由（如 `/customers`），但立即被重定向回 `/login` 页面。
浏览器 localStorage 中没有 `token` 和 `user`。

### 问题原因
在修复 Bug #1 时，创建 `AuthContext` 时**遗漏了 token 参数**：
1. `login` 函数签名只接收 `user: User`，缺少 `token: string` 参数
2. `login` 函数内部只保存了 `user`，没有保存 `token` 到 localStorage
3. `useEffect` 初始化时只检查 `user`，没有检查 `token`
4. `LoginPage` 调用 `login(user)` 时没有传递 `token`

结果：
- Token 永远不会被保存到 localStorage
- 页面刷新后，`isAuthenticated` 仍为 false
- 路由守卫 `PrivateRoute` 检测到未认证，重定向回登录页

### 解决方案

#### 1. 修复 AuthContext
```tsx
// 修改前
const login = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user))
  setUser(user)
  setIsAuthenticated(true)
}

// 修改后
const login = (user: User, token: string) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  setUser(user)
  setIsAuthenticated(true)
}
```

#### 2. 修复 useEffect 初始化
```tsx
// 修改前
useEffect(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) { ... }
}, [])

// 修改后
useEffect(() => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  if (token && userStr) { ... }
}, [])
```

#### 3. 修复 LoginPage 调用
```tsx
// 修改前
const { user } = response.data
login(user)

// 修改后
const { user, token } = response.data
login(user, token)
```

#### 4. 修复类型定义
```tsx
// 修改前
export interface AuthResponse {
  token?: string  // 可选
}

// 修改后
export interface AuthResponse {
  token: string   // 必需
}
```

### 修改的文件
- ✅ 修改：`src/contexts/AuthContext.tsx` - 添加 token 参数和保存逻辑
- ✅ 修改：`src/pages/LoginPage.tsx` - 传递 token 参数
- ✅ 修改：`src/types/index.ts` - 修复 AuthResponse 类型

### 测试验证
```bash
npm run build  # ✅ 构建成功
```

### 测试步骤
1. 清空浏览器 localStorage（F12 → Application → Local Storage → Clear）
2. 访问 http://localhost:5173
3. 登录账号
4. 检查 localStorage：
   ```javascript
   localStorage.getItem('token')  // 应该有值
   localStorage.getItem('user')   // 应该有值
   ```
5. 应该成功跳转到 `/customers` 页面
6. 刷新页面，应该保持登录状态

---

修复时间: 2026-01-15

## Bug #5: 应该使用 HttpOnly Cookie 而不是 localStorage

### 问题描述
前端使用 localStorage 存储 token，存在 XSS 安全风险。
实际上后端已经实现了 HttpOnly Cookie 认证，但前端没有使用。

### 后端实现（已存在）
后端在 `src/routes/auth.ts` 中已经设置了 HttpOnly Cookie：
```typescript
setCookie(c, "auth_token", token, {
  httpOnly: true,    // JS 无法读取
  sameSite: "Lax",   // 防止 CSRF
  secure: isProd,    // 生产环境使用 HTTPS
  path: "/",
  maxAge: oneWeek,
});
```

后端认证中间件同时支持两种方式：
1. Cookie: `auth_token`
2. Authorization Header: `Bearer <token>`

### 前端错误
前端完全没有利用 HttpOnly Cookie：
- ❌ 使用 localStorage 存储 token
- ❌ 手动在 Authorization Header 中发送 token
- ❌ 没有设置 `withCredentials: true`

### 解决方案

#### 1. 启用 credentials
```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // 自动发送 Cookie
})
```

#### 2. 简化 AuthContext
```typescript
// 不再需要保存 token
const login = (user: User) => {
  // Token 在 HttpOnly Cookie 中，JS 无法访问
  localStorage.setItem('user', JSON.stringify(user))
  setUser(user)
  setIsAuthenticated(true)
}

// 不再需要 token 参数
interface AuthContextType {
  login: (user: User) => void  // 移除 token 参数
}
```

#### 3. 简化登录流程
```typescript
// LoginPage.tsx
const { user } = response.data
login(user)  // 不需要传递 token
```

### 安全对比

| 方案 | XSS 安全 | 实现 |
|------|----------|------|
| localStorage | ❌ JS 可读取 | 前端控制 |
| HttpOnly Cookie | ✅ JS 无法读取 | 后端设置 |

### 修改的文件
- ✅ 修改：`src/lib/api.ts` - 已有 withCredentials
- ✅ 修改：`src/contexts/AuthContext.tsx` - 移除 token 处理
- ✅ 修改：`src/pages/LoginPage.tsx` - 简化登录
- ✅ 修改：`src/types/index.ts` - token 仍需要（后端兼容性）

### 工作原理
1. 用户登录成功
2. 后端设置 `auth_token` HttpOnly Cookie
3. 浏览器自动存储 Cookie
4. 后续请求自动携带 Cookie
5. 前端只需保存 `user` 用于显示

### 测试验证
```bash
npm run build  # ✅ 构建成功
```

打开浏览器开发者工具：
- Application → Cookies → 可以看到 `auth_token`（HttpOnly）
- Console → `document.cookie` → **看不到** `auth_token`（安全！）

---

修复时间: 2026-01-15

## Bug #6: 刷新页面后重定向到登录页（免登录失效）

### 问题描述
登录成功后，刷新页面会立即重定向回登录页，无法保持登录状态。

### 问题原因
前端 `AuthContext` 初始化时：
1. 从 localStorage 读取 `user`
2. 直接设置 `isAuthenticated = true`
3. **没有验证 HttpOnly Cookie 中的 token 是否有效**

结果：
- 如果 Cookie 已过期，localStorage 还有 user
- 前端认为已登录，但 API 请求返回 401
- 被拦截器重定向到登录页

### 解决方案

#### 1. 添加会话验证接口
```typescript
// src/lib/api.ts
export const authApi = {
  verifySession: () => api.get('/api/stores'),
}
```

#### 2. 初始化时验证 Cookie
```typescript
// src/contexts/AuthContext.tsx
useEffect(() => {
  const initAuth = async () => {
    const userStr = localStorage.getItem('user')

    if (userStr) {
      const userData = JSON.parse(userStr)

      try {
        // 调用任意需要认证的接口，验证 Cookie
        await authApi.verifySession()
        // Cookie 有效，恢复登录状态
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        // Cookie 无效或过期，清除本地数据
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }

  initAuth()
}, [])
```

#### 3. 添加加载状态
```typescript
const [isLoading, setIsLoading] = useState(true)

if (isLoading) {
  return null  // 初始化时不渲染，避免闪烁
}
```

### 工作流程

**首次登录：**
1. 登录成功 → 后端设置 Cookie
2. 前端保存 user 到 localStorage
3. 设置 isAuthenticated = true

**刷新页面：**
1. 读取 localStorage 中的 user
2. **调用 API 验证 Cookie**
3. 验证成功 → 恢复登录状态
4. 验证失败 → 清除 user，跳转登录页

### 修改的文件
- ✅ 修改：`src/lib/api.ts` - 添加 verifySession
- ✅ 修改：`src/contexts/AuthContext.tsx` - 初始化验证

### 测试验证
```bash
npm run build  # ✅ 构建成功
```

### 测试步骤
1. 登录系统
2. 刷新页面（F5）
3. 应该保持登录状态，不重定向到登录页
4. 等待 7 天后（或手动清除 Cookie）
5. 刷新页面，自动跳转到登录页

---

修复时间: 2026-01-15
