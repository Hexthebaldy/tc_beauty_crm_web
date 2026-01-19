# 快速启动指南

## 前置条件

1. **安装Node.js**: 确保已安装 Node.js >= 18
   ```bash
   node --version  # 应该显示 v18.x.x 或更高
   ```

2. **启动后端服务**: 确保后端API服务正在运行
   - 默认地址: http://localhost:8079
   - 参考后端项目的启动说明

## 三步启动前端

### 第一步：安装依赖
```bash
cd /Users/yang/Dev/tc_beauty_client/tc_beauty_crm_web
npm install
```

### 第二步：配置环境变量
已经配置好 `.env` 文件，默认连接本地后端：
```env
VITE_API_BASE_URL=http://localhost:8079
```

如需修改后端地址，编辑 `.env` 文件。

### 第三步：启动开发服务器
```bash
npm run dev
```

看到类似输出表示启动成功：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 访问应用

打开浏览器访问: http://localhost:5173

## 登录测试

### 创建测试账号
如果后端没有测试账号，先使用API创建：

```bash
curl -X POST http://localhost:8079/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13900000000","password":"123456","role":"admin"}'
```

### 登录系统
1. 在登录页面输入手机号: 13900000000
2. 输入密码: 123456
3. 点击"登录"按钮

## 主要功能

### 客户管理
- 查看客户列表
- 搜索客户
- 新增客户
- 编辑客户信息

### 履约记录
- 查看履约记录列表
- 按状态筛选
- 新增履约记录
- 编辑履约状态

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run tsc

# 代码检查
npm run lint
```

## 目录结构

```
tc_beauty_crm_web/
├── src/
│   ├── components/      # 组件
│   ├── pages/          # 页面
│   ├── hooks/          # Hooks
│   ├── lib/            # 工具库
│   └── types/          # 类型定义
├── docs/               # 文档
├── package.json        # 依赖配置
└── .env               # 环境变量
```

## 故障排查

### 端口已被占用
如果5173端口已被占用，Vite会自动使用下一个可用端口（5174, 5175...）

### 无法连接后端
1. 检查后端服务是否运行: `curl http://localhost:8079/healthz`
2. 检查 `.env` 中的 `VITE_API_BASE_URL` 配置
3. 查看浏览器控制台的网络请求

### CORS错误
确保后端已配置CORS允许前端域名访问。

### 依赖安装失败
1. 清除npm缓存: `npm cache clean --force`
2. 删除node_modules: `rm -rf node_modules`
3. 重新安装: `npm install`

## 下一步

- 阅读 [README.md](./README.md) 了解项目详情
- 阅读 [docs/USAGE.md](./docs/USAGE.md) 了解使用说明
- 阅读 [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) 了解开发指南
- 阅读 [docs/FEATURES.md](./docs/FEATURES.md) 了解功能详情

## 需要帮助？

- 查看项目文档目录 `docs/`
- 检查浏览器控制台错误信息
- 检查后端API日志

## 开发提示

1. **热更新**: 修改代码后浏览器会自动刷新
2. **TypeScript**: VSCode会提供智能提示和类型检查
3. **React DevTools**: 安装浏览器扩展可以调试React组件
4. **Network面板**: 使用浏览器DevTools查看API请求

## 生产部署

### 构建
```bash
npm run build
```

### 部署
将 `dist/` 目录部署到任何静态服务器：
- Nginx
- Apache
- Vercel
- Netlify
- 云服务商的对象存储

### 配置示例 (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 成功标志

✅ npm install 无错误
✅ npm run dev 启动成功
✅ 浏览器可以访问 http://localhost:5173
✅ 可以看到登录页面
✅ 登录成功后可以看到客户管理页面

---

**祝你使用愉快！** 🎉
