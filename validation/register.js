const validator = require('validator')

const isEmpty = value => {
  return value == undefined || value == null || (typeof value === 'object') && Object.keys(value).length === 0 || (typeof value === 'string') && value.trim().length === 0
}

module.exports = function validateRegisterInput(data) {
  let errors = {}
  if(!validator.equals(data.password, data.password2)) {
    errors.msg = '两次密码输入不一致'
  }
  
  if(validator.isEmpty(data.password2 || '')) {
    errors.msg = '确认密码不能为空'
  }

  if(!validator.isEmail(data.email)) {
    errors.msg = '邮箱不合法'
  }

  if(validator.isEmpty(data.email)) {
    errors.msg = '邮箱不能为空'
  }

  if(!validator.isLength(data.password, {min:6, max:20})) {
    errors.msg = '密码的长度在6-20位之间'
  }
  
  if(validator.isEmpty(data.password)) {
    errors.msg = '密码不能为空'
  }

  if(!validator.isLength(data.username, {min:3, max:12})) {
    errors.msg = '用户名的长度应为3位到12位之间'
  }

  if(validator.isEmpty(data.username)) {
    errors.msg = '用户名不能为空'
  }
 
  return {
    errors,
    isValid:isEmpty(errors)
  }
}