// 获取用户资料
exports.getUserProfile = async (req, res, next) => {
  try {
    res.send('getProfile')
  } catch (err) {
    next(err)
  }
}

// 关注用户
exports.followUser = async (req, res, next) => {
  try {
    res.send('followUser')
  } catch (err) {
    next(err)
  }
}

// 取消关注用户
exports.unFollowUser = async (req, res, next) => {
  try {
    res.send('unFollowUser')
  } catch (err) {
    next(err)
  }
}
