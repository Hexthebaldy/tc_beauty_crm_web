# 美业CRM管理系统 - 前端

基于 React + TypeScript + Vite + shadcn/ui 开发的美业CRM管理系统前端应用。

## 功能特性

- 用户登录认证
- 客户管理（CRUD操作）
  - 客户列表查看
  - 新增客户
  - 编辑客户信息
  - 搜索客户（姓名/手机号）
- 履约记录管理（CRUD操作）
  - 履约记录列表
  - 新增履约记录
  - 编辑履约状态
  - 按状态筛选

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **UI组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **状态管理**: TanStack Query (React Query)
- **HTTP客户端**: Axios
- **日期处理**: date-fns
- **图标**: Lucide React

## 快速开始

### 前置要求

- Node.js >= 18
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `.env.example` 为 `.env` 并配置后端API地址：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8079
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 组件
│   ├── ui/             # shadcn UI组件
│   └── Layout.tsx      # 布局组件
├── hooks/              # 自定义Hooks
│   └── useAuth.ts      # 认证Hook
├── lib/                # 工具库
│   ├── api.ts          # API服务
│   └── utils.ts        # 工具函数
├── pages/              # 页面组件
│   ├── LoginPage.tsx   # 登录页
│   ├── CustomersPage.tsx      # 客户管理页
│   └── FulfillmentsPage.tsx   # 履约记录页
├── types/              # TypeScript类型定义
│   └── index.ts
├── App.tsx             # 应用入口
├── main.tsx            # 渲染入口
└── index.css           # 全局样式
```

## API接口说明

后端API文档请参考: `docs/api.md`

默认API地址: `http://localhost:8079`

### 主要接口

- `POST /api/auth/login` - 用户登录
- `GET /api/customers` - 获取客户列表
- `POST /api/customers` - 创建客户
- `PUT /api/customers/:id` - 更新客户
- `GET /api/fulfillments` - 获取履约记录列表
- `POST /api/fulfillments` - 创建履约记录
- `PUT /api/fulfillments/:id` - 更新履约记录
- `GET /api/stores` - 获取门店列表
- `GET /api/employees` - 获取员工列表

## 开发说明

### 认证机制

系统使用JWT Token进行认证：
- 登录成功后，token存储在 localStorage
- API请求自动在 Header 中携带 `Authorization: Bearer <token>`
- Token过期或无效时自动跳转到登录页

### 状态管理

使用 TanStack Query 进行服务端状态管理：
- 自动缓存API响应
- 智能重新获取数据
- 乐观更新UI

### 样式开发

使用 Tailwind CSS 和 shadcn/ui：
- 使用 Tailwind 工具类编写样式
- shadcn/ui 组件可自定义主题
- 在 `src/index.css` 中配置主题变量

## 待开发功能

- [ ] 客户详情页面
- [ ] 履约记录详情页面
- [ ] 数据统计图表
- [ ] 导出功能
- [ ] 批量操作
- [ ] 高级搜索和筛选

## License

ISC
