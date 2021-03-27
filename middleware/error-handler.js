const util = require('util')

module.exports = () => {
  return (err, req, res, next) => {
    console.info(err)
    res.status(500).json({ error: util.format(err) })
  }
}
