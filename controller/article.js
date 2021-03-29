// 获取 Articles
exports.getArticles = async (req, res, next) => {
  try {
    res.send('getArticles')
  } catch (err) {
    next(err)
  }
}

// 获取 Feed Articles
exports.getFeedArticles = async (req, res, next) => {
  try {
    res.send('getFeedArticles')
  } catch (err) {
    next(err)
  }
}

// 获取 单个 Article
exports.getArticle = async (req, res, next) => {
  try {
    res.send('getArticle')
  } catch (err) {
    next(err)
  }
}

// 创建 单个 Article
exports.createArticle = async (req, res, next) => {
  try {
    res.send('createArticle with auth')
  } catch (err) {
    next(err)
  }
}

// 更新 单个 Article
exports.updateArticle = async (req, res, next) => {
  try {
    res.send('updateArticle')
  } catch (err) {
    next(err)
  }
}

// 删除 单个 Article
exports.deleteArticle = async (req, res, next) => {
  try {
    res.send('deleteArticle')
  } catch (err) {
    next(err)
  }
}

// 给 单个 Article 添加评论
exports.addCommentsToArticle = async (req, res, next) => {
  try {
    res.send('addCommentsToArticle')
  } catch (err) {
    next(err)
  }
}

// 获取 单个 Article 的所有评论
exports.getCommentsFromArticle = async (req, res, next) => {
  try {
    res.send('getCommentsFromArticle')
  } catch (err) {
    next(err)
  }
}

// 删除 评论
exports.deleteCommentsFromArticle = async (req, res, next) => {
  try {
    res.send('deleteCommentsFromArticle')
  } catch (err) {
    next(err)
  }
}

// 收藏 article
exports.favoriteArticle = async (req, res, next) => {
  try {
    res.send('favoriteArticle')
  } catch (err) {
    next(err)
  }
}

// 取消收藏 article
exports.unFavoriteArticle = async (req, res, next) => {
  try {
    res.send('unFavoriteArticle')
  } catch (err) {
    next(err)
  }
}
