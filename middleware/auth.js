/**
 * 中间件: 认证身份
 */

const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const { User } = require('../model')

module.exports = async (req, res, next) => {
  // 从请求头获取 token 数据
  let token = req.headers['authorization']
  token = token ? token.split('Bearer ')[1] : null
  // 无效 => 响应 401 状态码
  if (!token) {
    return res.status(401).end()
  }

  // 验证 token 是否有效
  try {
    const decodedToken = await verify(token, jwtSecret)
    // console.info(decodedToken) // {userId: xxxxxxxxxxxxxxx, iat: 160222222}
    // 有效 => 把用户信息读取出来挂载到 req 请求对象上, 继续往后执行
    const user = await User.findById(decodedToken.userId)
    // console.info(user) // {userId: xxxxxxxxxxxxxxx, iat: 160222222}
    req.user = user
    next()
  } catch (err) {
    return res.status(401).end()
  }
}
