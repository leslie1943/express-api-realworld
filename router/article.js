const express = require('express')
const articleCtrl = require('../controller/article')
const router = express.Router()

// 文章列表
router.get('/', articleCtrl.getArticles)
// 获取自己的文章列表
router.get('/feed', articleCtrl.getFeedArticles)
// 获取单个文章详情
router.get('/:slug', articleCtrl.getArticle)
// 创建
router.post('/', articleCtrl.createArticle)
// 更新
router.put('/:slug', articleCtrl.updateArticle)
// 删除
router.delete('/:slug', articleCtrl.deleteArticle)
// Comments to article
router.post('/:slug/comments', articleCtrl.addCommentsToArticle)
// Comments on article
router.get('/:slug/comments', articleCtrl.getCommentsFromArticle)
// delete comment on article
router.delete('/:slug/comments/:id', articleCtrl.deleteCommentsFromArticle)
// Favorite Article
router.post('/:slug/favorite', articleCtrl.favoriteArticle)
// Unfavorite  Article
router.delete('/:slug/favorite', articleCtrl.unFavoriteArticle)

module.exports = router
