const express = require('express')

const router = express.Router()

// 用户相关
router.use(require('./user'))

// 用户资料相关
router.use('/profiles', require('./profile'))

// 文章相关
router.use('/articles', require('./article'))

// 标签相关
router.use('/tags', require('./tags'))

module.exports = router
