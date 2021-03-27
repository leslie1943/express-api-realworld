const crypto = require('crypto')

// 获取 crypto 支持散列得算法
// console.info(crypto.getHashes())

module.exports = (orginValue) => {
  return crypto
    .createHash('md5')
    .update('leslie' + orginValue)
    .digest('hex')
}
