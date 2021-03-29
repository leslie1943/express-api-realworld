### Restful- 协议
- 尽量使用 `https`

### Restful- 域名
- 尽量将API部署到专用域名下: `https://api.example.com`
- 如果确定结果简单,不会有进一步的扩展, 可以放在主域名下: `https://example.org/api/`

### Restful- 版本
- 将 `API` 的版本号放入 `URL`


### Restful- 路径
- 路径称为 `endpoint`, 表示API的具体网址
- 在`restful`的架构中, 每个网址代表一种资源(`resource`), 所以网址中不能有动词,只能有名词. `复数`

### Restful- HTTP 动词
- GET: 读取
- POST: 创建
- PUT: 完整更新
- PATCH: 部分更新
- DELETE: 删除
- HEAD: 获取资源的元数据
- OPTIONS: 获取信息, 关于资源的哪些属性是客户端可以改变的

### Restful- 状态码
- 1xx: 相关信息
- 2xx: 操作成功
- 3xx: 重定向
- 4xx: 客户端信息
- 5xx: 服务器错误

### Restful- 返回结果
- API 返回的数据格式, 应该是一个JSON对象, 这样才能返回标准的结构化数据. 所以 服务器回应的`HTTP`头的`Content-Type`属性要设置为`application/json`

### Restful- 身份认证
- 基于 `JWT`的接口权限认证
- 字段名: `Authorization`
- 字段值: `Bearer token 数据`

### Restful- 跨域处理
- 可以在服务端设置`CORS`允许客户端跨域资源请求


### 命令行设置端口
- 1. 执行 `set port=4004`
- 2. 执行 `nodemon app.js`


### 连接数据库: Mongoose
- 参照 `model/index.js`
```js
const mongoose = require('mongoose')

// 连接 MongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/realworld')

const db = mongoose.connection
// 失败的时候
db.on('error', (err) => {
  console.info('MongoDB 数据库连接失败', err)
})

// 成功的时候
db.once('open', function () {
  console.info('MongoDB 数据库连接成功')
})
```

### 创建数据模型
- 💛 定义模型  `model/user.js`
```js
const mongoose = require('mongoose')

// 定义用户数据模型
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = userSchema

```
- 💛 组织所有的数据模型 `model/index.js`
```js
module.exports = {
  // model的参数: 大写开头,单数 ===> 生成到数据是 小写复数
  User: mongoose.model('User', require('./user')),
  Article: mongoose.model('Article', require('./article')),
}
```

- 💛 使用定义好的模型 `controller/user.js`
```js
// controller下的user.js
const { User } = require('../model')
// 生成一条数据
const user = new User(req.body.user)
// 开始操作数据
user.apiAction()
```


### 格式及数据校验(1)
- 封装校验中间件`src/middleware/validator.js`
```js
const { validationResult } = require('express-validator')
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    return res.status(400).json({ errors: errors.array() })
  }
}
module.exports = validate
```
### 格式及数据校验(2)
- 自定义需要校验的模块 `src/validator/user.js`
- 定义模块下的某个方法: `register`
```js
const { body } = require('express-validator')
const { User } = require('../model')
const validate = require('../middleware/validator') // 使用中间件

exports.register = validate(
  // 👮‍♂️ 1. 中间件: 配置验证规则
  [
    // ---------------- 验证用户名
    body('user.username')
      .notEmpty()
      .withMessage('用户名不能为空')
      .custom(async (username) => {
        /** 自定义配置校验规则 🔶🔶 异步调用 🔶🔶 */
        const user = await User.findOne({ username })
        if (user) {
          return Promise.reject('用户名已存在')
        }
      }),
    // ---------------- 验证密码
    body('user.password').notEmpty().withMessage('密码不能为空'),
    // ---------------- 验证邮箱
    body('user.email')
      .notEmpty()
      .withMessage('邮箱不能为空')
      .isEmail()
      .withMessage('邮箱格式不正确')
      .bail() /** 如果前面有错不再继续执行 */
      .custom(async (email) => {
        /** 自定义配置校验规则 🔶🔶 异步调用 🔶🔶 */
        const user = await User.findOne({ email })
        if (user) {
          return Promise.reject('邮箱已存在')
        }
      }),
  ]
)
```

### 格式及数据校验(3)
- 路由文件中使用校验方法 `src/router/user.js`
```js
const express = require('express')
const userContrl = require('../controller/user')
const userValidator = require('../validator/user')

const router = express.Router()

// 用户登录
router.post('/users/login', userContrl.login)

// 用户注册
router.post(
  '/users',
  // 验证数据
  userValidator.register, // 💛💛💛💛💛💛💛 这里
  // ✅ 通过验证, 执行具体得控制器方法处理
  userContrl.register
)

// 获取当前登录用户
router.get('/user', userContrl.getCurrentUser)

// 更新当前登录用户
router.put('/user', userContrl.updateCurrentUser)

module.exports = router
```

### JWT
- JSON Wen Token:最流行的跨域认证解决方案
- 互联网服务离不开用户认证, 一般流程是这样的
1. 用户向服务器发送用户名和密码
2. 服务器验证通过后, 在当前对话(`session`)里面保存相关数据, 比如用户角色, 登录时间等等
3. 服务器向用户返回一个 `session_id`, 写入用户的 `Cookie`
4. 随后用户的每一次请求, 都会通过 `Cookie`, 将`session_id`传回服务器
5. 服务器收到`session_id`后,找到前期保存的数据, 由此得知用户的身份

- 服务器认证后, 生成一个JSON对象, 发回给用户
```json
{
  "name": "suzhen",
  "role": "administrator",
  "expired": "2099-12-31"
}
```
- `JWT`的三个部分
- `Header.Payload.Signature`
1. Header: 头部: JSON 对象, 描述 JWT的元数据
```json
{
  "alg": "HS256", // 签名算法
  "typ": "JWT" // 类型:
}
// base64转换
```
2. Payload: 负载
```json
{
  // 官方字段
  "iss": "签发人",
  "exp": "过期时间", 
  "sub": "主题", 
  "adu": "受众", 
  "nbf": "生效时间", // not before 
  "iat": "签发时间", // issue at
  "jti": "JWT id", // 编号

  // 私有字段
  "sub": "123456",
  "name": "Leslie",
  "admin": true
}
// JWT 默认不加密,不要把敏感信息放在这个部分
// 这个JSON对象也使用 BASE64URL 算法转成字符串
```
3. Signature: 签名
- 前面个属性生成的密钥,保证前面2个数据不被篡改, 签名是在服务端生成的, 不能伪造
1. 首先指定一个密钥(secret). 这个密钥只有服务器知道, 不能泄露给用户,然后使用Header里面的指定的签名算法(HMAC SHA256),按照下列公式生成签名
```bash
  HAMCSHA256(
    base64UrlEncode(header) + '.' + 
    base64UrlEncode(payload),
    secret
  )
```
- 算出签名后,把 Header.Payload.Signature 三个部分拼成一个字符串, 每个部分用`.`分割, 就可以返回给用户了
- `JWT中, 消息体是透明的, 使用签名可以保证消息不被篡改,但不能实现数据的加密功能`, 只是编码,不是加密


### Base64Url
- Base64会生成`+`,`=` 不方便在URL传递


### JWT的使用方式
- 客户端收到服务器返回的JWT, 可以存储在Cookie里面, 也可以存储在 localStorage
- 此后,客户端每次与服务器通信, 都要携带这个JWT. 可以把它放在 Cookie里面自动发送, 但是这样不能跨域, 随意更好的做法是放在`HTTP`请求的头信息 `Authorization`字段里面
```
Authorization: Bearer <token>
```
- 另一种做法是, 跨域的时候, JWT就放在 POST 请求的数据体里面

### JWT的特点
1. `JWT`默认是不加密的, 但也可以是加密的. 生成原始token后,可以用密钥再加密一次
2. `JWT`不加密的情况下, 不能将秘密数据写入`JWT`
3. `JWT`不仅可以用于认证, 也可以用于交换信息. 有效使用 `JWT`, 可以降低服务器查询数据库的次数
4. `JWT`的最大缺点是, 由于服务器不保存 `session` 状态, 因此无法再使用过程中废止某个token, 或者更改 `token` 的权限. 也就是说 一旦`JWT`签发了,在到期之前就会始终有效, 除非服务器部署额外的逻辑
5. `JWT`本身包含了认证信息, 一旦泄露, 任何人都可以获得该令牌的所有权限. 为了防止盗用, `JWT`的有效期应该设置的比较短. 对于一些比较重要的权限, 使用时应该再次对用户进行认证
6. 为了防止盗用, `JWT`不应该使用 `HTTP` 协议明码传输, 需要使用 `HTTPS` 协议传输.

### JWT 的解决方案
- https://jwt.io

### Node.js中使用JWT
- npm install jsonwebtoken
```js
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
exports.sign = promisify(jwt.sign)
exports.verify = promisify(jwt.verify)
exports.decode = promisify(jwt.decode)
```


### JWT 使用过程
1. `util`中封装`jwt.js`,导出`sign`和`verify`方法, 分别对应加密和解密的方法
2. 登录的时候, `controller/user.js`中, 将`token`和`用户信息`一同返回
3. 返回后的信息被存放在客户端本地, 在后续的请求中携带过来.
4. 封装`middleware/auth.js`中间件, 并将其配置在需要身份认证的请求中.
5. 获取请求头带回来的`token`,然后对`token`解码, 解码后查询到对应的用户信息, 并挂载到`req`上下文中. 一共后续的其他地方使用,如: `controller`