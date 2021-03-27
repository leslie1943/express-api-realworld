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