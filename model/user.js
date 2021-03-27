const mongoose = require('mongoose')
const md5 = require('../util/md5')

const base = require('./base')

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
    set: (value) => md5(value), // md5加密数据
    select: false, // 查询时不返回
  },
  bio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  ...base,
})

module.exports = userSchema
