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
  userValidator.register,
  // ✅ 3. 通过验证, 执行具体得控制器方法处理
  userContrl.register
)

// 获取当前登录用户
router.get('/user', userContrl.getCurrentUser)

// 更新当前登录用户
router.put('/user', userContrl.updateCurrentUser)

module.exports = router
