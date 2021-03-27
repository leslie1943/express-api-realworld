const { User } = require('../model')

// 用户登录
exports.login = async (req, res, next) => {
  try {
    // 1. 获取请求体数据
    // 2. 数据验证
    // 3. 验证通过, 将数据保存到数据库
    // 4. 发送响应
    res.send('post /users/login')
  } catch (err) {
    next(err)
  }
}

// 用户注册
exports.register = async (req, res, next) => {
  try {
    // 1. 获取请求体数据
    console.info(req.body)
    // 2. 数据验证
    // 基本数据验证/业务验证数据

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
    res.send('get getCurrentUser')
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
