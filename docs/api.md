# tc_beauty_crm_service 接口文档（后端 Hono）

基础信息
- Base URL：默认 `http://localhost:3000`
- 内容类型：`application/json`
- 认证：登录成功返回 `token`；需鉴权的接口在 Header 携带 `Authorization: Bearer <token>`

## 1) 健康检查
- `GET /healthz` → `{ ok: true }`

## 2) 认证
- 注册 `POST /api/auth/register`
  - Body：`{ phone: string(6-20), password: string(>=6), role?: admin|manager|staff }`
  - 返回：`{ user, token, expiresAt }`；手机号冲突 409
- 登录 `POST /api/auth/login`
  - Body：`{ phone, password }`
  - 返回：`{ user, token, expiresAt }`；不存在 404，密码错 401
- Token 说明：7 天过期；后续请求带 `Authorization: Bearer <token>`

## 3) 客户 Customers
- 列表 `GET /api/customers`
  - Query：`storeId?`, `ownerEmployeeId?`, `q?`(姓名/手机号模糊), `limit?=50`, `offset?=0`
  - 返回：`{ data: Customer[] }`
- 新增 `POST /api/customers` （需鉴权）
  - Body：`{ name, phone, gender?, birthday?, source?, tags?: string[], preferredStoreId?, ownerEmployeeId?, status? }`
  - 返回：`{ data: Customer }`；手机号冲突 409，外键缺失 400
- 更新 `PUT /api/customers/:id` （需鉴权）
  - Body：同上任意字段
  - 返回：`{ data: Customer }`；未找到 404，冲突/外键同上

## 4) 履约记录 Fulfillments
- 列表 `GET /api/fulfillments`
  - Query：`storeId?`, `employeeId?`, `customerId?`, `status?`(ordered|fulfilled|refunded), `limit?=50`, `offset?=0`
  - 返回：`{ data: Fulfillment[] }`
- 新增 `POST /api/fulfillments` （需鉴权）
  - Body：`{ customerId, storeId, employeeId?, amount, currency?=CNY, status?=ordered, channel?, note?, paidAt? }`
  - 返回：`{ data: Fulfillment }`；外键缺失 400
- 更新 `PUT /api/fulfillments/:id` （需鉴权）
  - Body：`{ status?, note?, channel?, paidAt? }`
  - 返回：`{ data: Fulfillment }`；未找到 404，外键缺失 400

## 5) 字典
- 门店 `GET /api/stores` → `{ data: {id, code, name, status, city}[] }`
- 员工 `GET /api/employees`（可带 `storeId`）→ `{ data: {id, name, title, status, storeId}[] }`

## 6) 请求示例
```bash
# 注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13900000000","password":"123456"}'

# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13900000000","password":"123456"}'

# 新增客户（需 token）
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"张三","phone":"13911112222","preferredStoreId":1}'

# 新增履约记录
curl -X POST http://localhost:3000/api/fulfillments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"customerId":1,"storeId":1,"amount":199.00,"channel":"meituan","status":"ordered"}'
```
