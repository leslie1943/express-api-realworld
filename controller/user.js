const { jwtSecret } = require('../config/config.default')
const jwt = require('../util/jwt')
const { User } = require('../model')

// 用户登录
exports.login = async (req, res, next) => {
  try {
    // 1.数据获取和验证: 在router上挂载中间件(validator中)
    let user = req.user.toJSON() // 无法删除 req.user的属性操作, 需要 toJSON后才行
    // 删除密码属性
    delete user.password
    // 2. 生成token
    const token = await jwt.sign(
      {
        userId: user._id,
      },
      jwtSecret,
      { expiresIn: 60 * 60 * 24 } // 过期时间
    )

    res.status(200).json({ ...user, token })
  } catch (err) {
    next(err)
  }
}

// 用户注册
exports.register = async (req, res, next) => {
  try {
    // 1. 获取请求体数据: 中间件完成
    // 2. 数据验证: 中间件完成
    // 3. 验证通过, 将数据保存到数据库
    let user = new User(req.body.user)
    await user.save()
    // Mongoose对象转换成普通的对象
    user = user.toJSON()
    // 删除 password 属性
    delete user.password
    // 4. 发送响应
    res.status(201).json({ user })
  } catch (err) {
    next(err)
  }
}

// 获取当前登录用户
exports.getCurrentUser = async (req, res, next) => {
  try {
    // 在 auth 中间件中,处理了 user
    res.status(200).json({ user: req.user })
  } catch (err) {
    next(err)
  }
}

// 更新
exports.updateCurrentUser = async (req, res, next) => {
  try {
    res.send('update getCurrentUser')
  } catch (err) {
    next(err)
  }
}
