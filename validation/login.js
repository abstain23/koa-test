const validator = require('validator')

const isEmpty = value => {
  return value == undefined || value == null || (typeof value === 'object') && Object.keys(value).length === 0 || (typeof value === 'string') && value.trim().length === 0
}

module.exports = function validateLoginInput(data) {
  let errors = {}
 
  if(!validator.isLength(data.password, {min:6, max:20})) {
    errors.msg = '密码的长度在6-20位之间'
  }
  
  if(validator.isEmpty(data.password)) {
    errors.msg = '密码不能为空'
  }

  if(!data.email && !data.username) {
    errors.msg = '请输入用户名或邮箱'
  }

  if(data.email) {
    if(!validator.isEmail(data.email)) {
      errors.msg = '邮箱不合法'
    }
  }

  if(data.username) {
    if(!validator.isLength(data.username, {min:3, max:12})) {
      errors.msg = '用户名的长度应为3位到12位之间'
    }
  }



  return {
    errors,
    isValid:isEmpty(errors)
  }
}