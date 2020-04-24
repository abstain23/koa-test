const Router = require('koa-router')
const router = new Router()

//生成token
const jwt = require('jsonwebtoken')
const {
  privateKey
} = require('../../config/db')
const passport = require('koa-passport')
//引入Usermodel
const User = require('../../models/User')

//引入加密方法
const {
  bcryptPassword,
  checkPassword
} = require('../../utils/utils')

//引入验证
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

/**
 * @route GET api/user/test
 * @desc 测试接口地址
 * @access 公开的
 */

router.get('/test', async ctx => {
  ctx.status = 200
  ctx.body = {
    msg: 'test ok'
  }
})

/**
 * @route POST api/user/register
 * @desc 注册接口地址
 * @access 公开的
 */

router.post('/register', async ctx => {
  // console.log(ctx.request.body)
  const {errors, isValid} = validateRegisterInput(ctx.request.body)

  if(!isValid) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  const {
    email,
    username,
    password
  } = ctx.request.body
  const findEmailRes = await User.find({
    email
  })
  const findNameRes = await User.find({
    username
  })
  if (findEmailRes.length > 0) {
    ctx.status = 500
    ctx.body = {
      email: '邮箱已经被注册'
    }
  } else if (findNameRes.length > 0) {
    ctx.status = 500
    ctx.body = {
      email: '该用户名已经被注册'
    }
  } else {
    const newUser = new User({
      username,
      email,
      password: bcryptPassword(password)
    })
    // await bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(newUser.password, salt, async (err, hash) => {
    //     // console.log(hash)
    //     if(err) {throw err}
    //     newUser.password = hash
    //     newUser.save().then(() => {
    //       console.log('ok')
    //     }).catch(err => {
    //       console.log(err)
    //     })
    //   });
    // });
    try {
      const user = await newUser.save()
      ctx.status = 200
      ctx.body = {
        msg: '注册成功',
        data: user
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = {
        msg: '注册失败',
        data: err
      }
    }
  }
})

/**
 * @route POST api/user/login
 * @desc 登录接口地址 返回一个token
 * @access 公开的
 */

router.post('/login', async ctx => {
  const {errors, isValid} = validateLoginInput(ctx.request.body)
  
  if(!isValid) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  
  const {
    email,
    password,
    username
  } = ctx.request.body
  const findUser = await User.find({
    $or: [{
        email: email
      },
      {
        username,
        username
      }
    ]
  })
  // console.log(findUser)
  const dbUser = findUser[0]
  if (findUser.length === 0) {
    ctx.status = 400
    ctx.body = {
      msg: '用户名或邮箱有误'
    }
  } else {
    const res = checkPassword(password, dbUser.password)
    if (res) {
      const signToken = {
        id: dbUser.id,
        username: dbUser.username
      }
      const token = jwt.sign(signToken, privateKey, {
        expiresIn: 60 * 60 * 24 // 秒
      })
      ctx.status = 200
      ctx.body = {
        msg: '登录成功',
        token: `Bearer ${token}`
      }
    } else {
      ctx.status = 400
      ctx.body = {
        msg: '密码错误'
      }
    }
  }
})


/**
 * @route GET api/user/info
 * @desc 用户信息接口地址 返回用户信息
 * @access 私有的 需要携带token
 */
router.get('/info', passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const {id, username, email} = ctx.state.user
  ctx.body = {
    data: {
      id,
      username,
      email
    },
    msg: '获取成功'
  }
})

module.exports = router.routes()