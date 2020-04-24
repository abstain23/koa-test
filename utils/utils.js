//引入bcrypt 对密码加密
const bcrypt = require('bcryptjs')

module.exports = {
  bcryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt)
  },
  checkPassword(userPass, dbPass) {
    return bcrypt.compareSync(userPass, dbPass)
  }
}