const { body } = require('express-validator')

const { User } = require('../model')
const validate = require('../middleware/validator')

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
