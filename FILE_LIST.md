# 项目文件清单

## 配置文件
- `package.json` - 项目依赖和脚本配置
- `tsconfig.json` - TypeScript编译配置
- `tsconfig.node.json` - Node环境TypeScript配置
- `vite.config.ts` - Vite构建配置
- `tailwind.config.js` - Tailwind CSS配置
- `postcss.config.js` - PostCSS配置
- `.env` - 环境变量配置
- `.gitignore` - Git忽略文件配置
- `index.html` - HTML入口文件

## 文档文件
- `README.md` - 项目说明
- `QUICKSTART.md` - 快速启动指南
- `PROJECT_SUMMARY.md` - 项目总结
- `FILE_LIST.md` - 本文件
- `docs/api.md` - API接口文档
- `docs/FEATURES.md` - 功能说明文档
- `docs/DEVELOPMENT.md` - 开发指南
- `docs/USAGE.md` - 使用手册

## 源代码文件

### 应用入口
- `src/main.tsx` - React应用入口
- `src/App.tsx` - 应用路由配置
- `src/index.css` - 全局样式
- `src/vite-env.d.ts` - Vite环境类型定义

### 类型定义
- `src/types/index.ts` - TypeScript类型定义

### 工具库
- `src/lib/api.ts` - API服务封装
- `src/lib/utils.ts` - 工具函数

### 自定义Hooks
- `src/hooks/useAuth.ts` - 认证Hook

### 页面组件
- `src/pages/LoginPage.tsx` - 登录页面
- `src/pages/CustomersPage.tsx` - 客户管理页面
- `src/pages/FulfillmentsPage.tsx` - 履约记录页面

### 布局组件
- `src/components/Layout.tsx` - 主布局组件

### UI组件 (shadcn/ui)
- `src/components/ui/button.tsx` - 按钮组件
- `src/components/ui/input.tsx` - 输入框组件
- `src/components/ui/label.tsx` - 标签组件
- `src/components/ui/card.tsx` - 卡片组件
- `src/components/ui/dialog.tsx` - 对话框组件
- `src/components/ui/select.tsx` - 选择器组件
- `src/components/ui/table.tsx` - 表格组件
- `src/components/ui/toast.tsx` - 消息提示组件
- `src/components/ui/toaster.tsx` - 消息提示容器
- `src/components/ui/use-toast.ts` - Toast Hook

## 文件统计

### 配置文件: 9个
### 文档文件: 8个
### 源代码文件: 22个
### 总计: 39个核心文件

## 代码统计

- TypeScript/TSX文件: ~22个
- 代码总行数: ~2500行
- UI组件: 11个
- 页面组件: 3个
- 工具文件: 3个
- Hook文件: 1个

## 依赖统计

### 生产依赖
- react: React框架
- react-dom: React DOM渲染
- react-router-dom: 路由管理
- @tanstack/react-query: 数据管理
- axios: HTTP客户端
- date-fns: 日期处理
- lucide-react: 图标库
- @radix-ui/*: UI组件基础
- class-variance-authority: 样式变体
- clsx: 类名工具
- tailwind-merge: Tailwind合并
- tailwindcss-animate: 动画

### 开发依赖
- typescript: TypeScript
- vite: 构建工具
- @vitejs/plugin-react: React插件
- tailwindcss: CSS框架
- autoprefixer: CSS后处理
- postcss: CSS处理
- eslint: 代码检查

## 构建产物

### 开发模式
- 无产物，使用Vite HMR

### 生产构建
- `dist/index.html` - HTML文件
- `dist/assets/*.css` - 样式文件
- `dist/assets/*.js` - JavaScript文件

## 特殊文件

### 环境变量
- `.env` - 实际环境变量（已创建）
- `src/.env.example` - 环境变量模板

### Git
- `.git/` - Git版本控制
- `.gitignore` - Git忽略规则

### 依赖
- `node_modules/` - NPM依赖包
- `package-lock.json` - 依赖锁定文件

## 文件大小（构建后）

- HTML: ~0.5 KB
- CSS: ~24 KB (gzip: ~5 KB)
- JavaScript: ~415 KB (gzip: ~134 KB)
- 总计: ~440 KB (gzip: ~140 KB)

## 重要路径

### 开发
- 源代码: `src/`
- 页面: `src/pages/`
- 组件: `src/components/`
- 文档: `docs/`

### 构建
- 产物: `dist/`
- 依赖: `node_modules/`

### 配置
- 根目录: 所有配置文件
- 环境: `.env`

---

最后更新: 2026-01-15
