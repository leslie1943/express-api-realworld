const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const routers = require('./router/index')
const errorHandler = require('./middleware/error-handler')

// 连接数据库
require('./model')

const app = express()

// 中间件-日志
app.use(morgan('dev'))

// 中间件-解析请求体
app.use(express.json())
app.use(express.urlencoded())

app.use(cors())

const PORT = process.env.PORT || 3000

// 挂载路由
app.use('/api', routers)

// 挂载统一处理服务端错误的中间件
app.use(errorHandler())

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}!`)
})
