const mongoose = require('mongoose')
const { dbURI } = require('../config/config.default')

// 连接 MongoDB 数据库
mongoose.connect(dbURI)

const db = mongoose.connection
// 失败的时候
db.on('error', (err) => {
  console.info('MongoDB 数据库连接失败', err)
})

// 成功的时候
db.once('open', function () {
  console.info('MongoDB 数据库连接成功')
})

// 创建了一个模型
// const Cat = mongoose.model('Cat', { name: String })

// 使用模型初始化数据
// const kitty = new Cat({ name: 'Zildjian' })
// 将数据存储到数据库
// kitty.save().then(() => console.log('meow'))

// 组织导出模型类
module.exports = {
  // model的参数: 大写开头,单数 ===> 生成到数据是 小写复数
  User: mongoose.model('User', require('./user')),
  Article: mongoose.model('Article', require('./article')),
}
